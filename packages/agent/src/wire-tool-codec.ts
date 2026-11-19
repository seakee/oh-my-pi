import type {
	AssistantMessage,
	AssistantMessageEvent,
	AssistantMessageEventStream,
	Message,
	ToolChoice,
	ToolExample,
	TSchema,
} from "@oh-my-pi/pi-ai";
import {
	copyCursorExecResolved,
	getStreamingPartialJson,
	type StreamingPartialJsonCarrier,
	setStreamingPartialJson,
} from "@oh-my-pi/pi-ai/utils/block-symbols";
import { schemaDefinesProperty } from "@oh-my-pi/pi-ai/utils/schema/json-schema-validator";
import { toolWireSchema } from "@oh-my-pi/pi-ai/utils/schema/wire";
import { isRecord } from "@oh-my-pi/pi-utils";
import { INTENT_FIELD } from "@oh-my-pi/pi-wire";
import { messageEstimateVersion } from "./compaction/message-cache";
import type { AgentMessage, AgentTool } from "./types";

/** Wire-level replacement for `INTENT_FIELD` (`"i"`) when intent tracing is explicitly enabled. */
export const WIRE_INTENT_FIELD = "summary";
/** Wire-level description for `WIRE_INTENT_FIELD`. */
export const DEFAULT_WIRE_INTENT_DESCRIPTION = "brief action summary";

/** Canonical tool name -> Wire tool name presented to inference providers. */
export const CANONICAL_TO_WIRE_TOOL_NAME: Readonly<Record<string, string>> = Object.freeze({
	eval: "execute_code",
	task: "delegate_task",
	wait: "await_jobs",
	todo: "task_list",
	ask: "prompt_user",
	find: "semantic_search",
	ast_edit: "syntax_rewrite",
	ast_grep: "syntax_search",
	checkpoint: "save_checkpoint",
	rewind: "restore_checkpoint",
	context_notes: "session_notes",
	new_context: "reset_context",
	yield: "submit_output",
	goal: "manage_goal",
	think: "scratchpad",
});

/** Wire tool name -> Canonical internal tool name. */
export const WIRE_TO_CANONICAL_TOOL_NAME: Readonly<Record<string, string>> = Object.freeze(
	Object.fromEntries(Object.entries(CANONICAL_TO_WIRE_TOOL_NAME).map(([canonical, wire]) => [wire, canonical])),
);

interface ObjectCodecRule {
	/** Canonical property key -> Wire property key. */
	readonly keys?: Readonly<Record<string, string>>;
	/** Canonical property key -> enum string value map (canonical -> wire). */
	readonly enums?: Readonly<Record<string, Readonly<Record<string, string>>>>;
	/** Canonical property key -> replacement description when descriptions are retained. */
	readonly descriptions?: Readonly<Record<string, string>>;
	/** Nested object/array-item rules keyed by canonical property name. */
	readonly children?: Readonly<Record<string, ObjectCodecRule>>;
	/** Array item description override keyed by canonical property name. */
	readonly itemDescriptions?: Readonly<Record<string, string>>;
}

interface InvertedObjectRule {
	readonly keys: Readonly<Record<string, string>>;
	readonly enums: Readonly<Record<string, Readonly<Record<string, string>>>>;
	readonly children: Readonly<Record<string, InvertedObjectRule>>;
}

const EVAL_RUNTIME_LABELS: Readonly<Record<string, string>> = {
	python: "Python",
	javascript: "JavaScript",
};

const OBJECT_CODEC_RULES: Readonly<Record<string, ObjectCodecRule>> = {
	task: {
		keys: {
			context: "shared_context",
			tasks: "subtasks",
			solutionSpace: "scope",
			schemaMode: "schema_validation",
		},
		children: {
			tasks: {
				keys: {
					solutionSpace: "scope",
					schemaMode: "schema_validation",
				},
			},
		},
	},
	todo: {
		keys: {
			op: "action",
			list: "groups",
			phase: "group",
			task: "item",
		},
		enums: {
			op: {
				init: "create",
				rm: "remove",
				drop: "clear",
			},
		},
		descriptions: {
			list: "Task groups for creation",
			task: "Task label or array of task labels",
			items: "Task items for create or append",
		},
		children: {
			list: {
				keys: {
					phase: "group",
				},
			},
		},
	},
	eval: {
		keys: {
			language: "runtime",
			reset: "reset_state",
			title: "label",
		},
		enums: {
			language: {
				py: "python",
				js: "javascript",
			},
		},
		descriptions: {
			code: "Code block to execute",
			title: "Optional display label",
			reset: "Reset execution state before running",
		},
	},
	ask: {
		keys: {
			html: "form",
		},
		descriptions: {
			html: "HTML form markup",
		},
	},
	bash: {
		keys: {
			async: "background",
			pty: "tty",
			notify: "notify_on",
			name: "service_name",
			ready: "readiness",
		},
		descriptions: {
			name: "Service identifier for a long-running background process (1-48 characters, [A-Za-z0-9._-]); omit for finite commands.",
		},
	},
	grep: {
		keys: {
			case: "case_sensitive",
			skip: "offset",
		},
	},
	read: {
		descriptions: {
			path: "File path or URL with optional line selectors.",
		},
	},
	ast_edit: {
		descriptions: {
			paths: "Target files, directories, or glob patterns",
		},
		itemDescriptions: {
			paths: "Target file, directory, or glob pattern",
		},
	},
	ast_grep: {
		descriptions: {
			path: 'File, directory, or glob pattern to search; separate multiple paths with ";" (defaults to ".").',
		},
	},
};

const INVERTED_CODEC_RULES: Readonly<Record<string, InvertedObjectRule>> = Object.fromEntries(
	Object.entries(OBJECT_CODEC_RULES).map(([name, rule]) => [name, invertObjectRule(rule)]),
);

function invertRecord(record: Readonly<Record<string, string>> | undefined): Record<string, string> {
	if (!record) return {};
	const inverted: Record<string, string> = {};
	for (const [k, v] of Object.entries(record)) inverted[v] = k;
	return inverted;
}

function invertObjectRule(rule: ObjectCodecRule): InvertedObjectRule {
	const enums: Record<string, Record<string, string>> = {};
	if (rule.enums) {
		for (const [canonicalKey, map] of Object.entries(rule.enums)) {
			enums[canonicalKey] = invertRecord(map);
		}
	}
	const children: Record<string, InvertedObjectRule> = {};
	if (rule.children) {
		for (const [canonicalKey, child] of Object.entries(rule.children)) {
			children[canonicalKey] = invertObjectRule(child);
		}
	}
	return {
		keys: invertRecord(rule.keys),
		enums,
		children,
	};
}

/** Encode an internal canonical tool name into its Wire name (respecting explicit `customWireName`). */
export function encodeWireToolName(canonicalName: string, customWireName?: string): string {
	if (customWireName) return customWireName;
	return CANONICAL_TO_WIRE_TOOL_NAME[canonicalName] ?? canonicalName;
}

/** Decode a Wire tool name back into its canonical internal tool name. */
export function decodeWireToolName(wireName: string): string {
	return WIRE_TO_CANONICAL_TOOL_NAME[wireName] ?? wireName;
}

/** Translate the prompt-visible intent field name when intent tracing uses `"i"`. */
export function encodeWireIntentField(intentField: string | undefined): string | undefined {
	if (intentField === INTENT_FIELD) return WIRE_INTENT_FIELD;
	return intentField;
}

/** Encode a `ToolChoice` directive's tool name for the provider wire. */
export function encodeWireToolChoice(toolChoice: ToolChoice | undefined): ToolChoice | undefined {
	if (!toolChoice || typeof toolChoice === "string") return toolChoice;
	if (toolChoice.type === "tool") {
		const wire = encodeWireToolName(toolChoice.name);
		return wire === toolChoice.name ? toolChoice : { ...toolChoice, name: wire };
	}
	if (toolChoice.type === "function") {
		if ("name" in toolChoice && typeof toolChoice.name === "string") {
			const wire = encodeWireToolName(toolChoice.name);
			return wire === toolChoice.name ? toolChoice : { ...toolChoice, name: wire };
		}
		if ("function" in toolChoice && isRecord(toolChoice.function) && typeof toolChoice.function.name === "string") {
			const wire = encodeWireToolName(toolChoice.function.name);
			return wire === toolChoice.function.name
				? toolChoice
				: { ...toolChoice, function: { ...toolChoice.function, name: wire } };
		}
	}
	return toolChoice;
}

const schemaEncodeMemo = new WeakMap<object, Map<string, TSchema>>();

export interface EncodeWireSchemaOptions {
	/** Whether `INTENT_FIELD` (`"i"`) was injected into this schema by `normalizeTools` (false leaves tool-owned `"i"` untouched). */
	encodeIntent?: boolean;
	/** Intent field description override, if supplied by caller. */
	intentDescription?: string;
	/** Preserve empty/pruned schema descriptions without restoring overrides. */
	pruneDescriptions?: boolean;
}

/**
 * Transform a canonical JSON schema (with any injected `INTENT_FIELD`) into its Wire representation.
 * Memoized by canonical schema object identity.
 */
export function encodeWireSchema(
	canonicalToolName: string,
	schema: TSchema,
	options: EncodeWireSchemaOptions = {},
): TSchema {
	const canonicalName = decodeWireToolName(canonicalToolName);
	const rule = OBJECT_CODEC_RULES[canonicalName];
	const prune = options.pruneDescriptions === true;
	const hasIntentProp = schemaDefinesProperty(schema, INTENT_FIELD);
	const hasOriginalSummary = !hasIntentProp && schemaDefinesProperty(schema, WIRE_INTENT_FIELD);
	// Even when intent is injected, do not collide if the canonical tool already declared `summary`,
	// and never rename a tool-owned `i` when `encodeIntent: false` is explicit.
	const canonicalHasNativeSummary = canonicalDefinesNativeSummary(canonicalName, schema);
	const encodeIntent =
		options.encodeIntent !== undefined
			? options.encodeIntent && hasIntentProp && !canonicalHasNativeSummary
			: hasIntentProp && !canonicalHasNativeSummary && !hasOriginalSummary;
	if (!rule && !encodeIntent) return schema;

	const intentDescKey = options.intentDescription ?? "";
	const cacheKey = `${canonicalName}\0${prune ? "1" : "0"}\0${encodeIntent ? "1" : "0"}\0${intentDescKey}`;
	if (schema && typeof schema === "object") {
		let perSchema = schemaEncodeMemo.get(schema);
		const cached = perSchema?.get(cacheKey);
		if (cached) return cached;
		const transformed = transformSchemaNode(
			schema as Record<string, unknown>,
			rule,
			{
				isRoot: true,
				canonicalName,
				pruneDescriptions: prune,
				encodeIntent,
				intentDescription: options.intentDescription,
			},
			undefined,
			undefined,
		) as TSchema;
		if (!perSchema) {
			perSchema = new Map();
			schemaEncodeMemo.set(schema, perSchema);
		}
		perSchema.set(cacheKey, transformed);
		return transformed;
	}
	return schema;
}

function canonicalDefinesNativeSummary(canonicalName: string, schema: unknown): boolean {
	// If `i` was injected alongside a native `summary`, both properties exist in `schema.properties`.
	return isRecord(schema) && isRecord(schema.properties) && canonicalName !== "" && "summary" in schema.properties;
}

function formatEvalRuntimeDescription(enumValues: unknown, fallback: unknown): string | undefined {
	if (!Array.isArray(enumValues)) return typeof fallback === "string" ? fallback : undefined;
	const parts: string[] = [];
	for (const val of enumValues) {
		if (typeof val === "string") {
			const label = EVAL_RUNTIME_LABELS[val];
			parts.push(label ? `"${val}": ${label}` : `"${val}"`);
		}
	}
	return parts.length > 0 ? parts.join("; ") : typeof fallback === "string" ? fallback : undefined;
}

interface SchemaTransformCtx {
	readonly isRoot: boolean;
	readonly canonicalName: string;
	readonly pruneDescriptions: boolean;
	readonly encodeIntent: boolean;
	readonly intentDescription?: string;
}

function transformSchemaNode(
	node: Record<string, unknown>,
	rule: ObjectCodecRule | undefined,
	ctx: SchemaTransformCtx,
	enumMap: Readonly<Record<string, string>> | undefined,
	overrideItemDesc: string | undefined,
): Record<string, unknown> {
	let copy: Record<string, unknown> | undefined;
	const ensureCopy = () => {
		if (!copy) copy = { ...node };
		return copy;
	};

	if (enumMap) {
		if (Array.isArray(node.enum)) {
			const mappedEnum = node.enum.map(v => (typeof v === "string" ? (enumMap[v] ?? v) : v));
			ensureCopy().enum = mappedEnum;
			if (!ctx.pruneDescriptions && ctx.canonicalName === "eval" && "description" in node) {
				const runtimeDesc = formatEvalRuntimeDescription(mappedEnum, node.description);
				if (runtimeDesc !== undefined) ensureCopy().description = runtimeDesc;
			}
		}
		if (typeof node.const === "string" && enumMap[node.const] !== undefined) {
			ensureCopy().const = enumMap[node.const];
		}
	}

	if (isRecord(node.properties)) {
		const nextProps: Record<string, unknown> = {};
		let propsChanged = false;
		for (const [origKey, rawProp] of Object.entries(node.properties)) {
			const isIntentProp = ctx.isRoot && ctx.encodeIntent && origKey === INTENT_FIELD;
			const wireKey = isIntentProp ? WIRE_INTENT_FIELD : (rule?.keys?.[origKey] ?? origKey);
			if (wireKey !== origKey) propsChanged = true;

			let transformedProp = rawProp;
			if (isRecord(rawProp)) {
				const childRule = rule?.children?.[origKey];
				const propEnumMap = rule?.enums?.[origKey];
				const propItemDesc = !ctx.pruneDescriptions ? rule?.itemDescriptions?.[origKey] : undefined;
				transformedProp = transformSchemaNode(
					rawProp,
					childRule,
					{ ...ctx, isRoot: false },
					propEnumMap,
					propItemDesc,
				);
				if (isIntentProp && !ctx.pruneDescriptions && "description" in (transformedProp as Record<string, unknown>)) {
					const currentDesc = (transformedProp as Record<string, unknown>).description;
					const customIntentDesc =
						ctx.intentDescription && ctx.intentDescription !== "concise intent"
							? ctx.intentDescription
							: DEFAULT_WIRE_INTENT_DESCRIPTION;
					if (currentDesc === "concise intent" || customIntentDesc !== currentDesc) {
						transformedProp = { ...(transformedProp as Record<string, unknown>), description: customIntentDesc };
					}
				} else if (!ctx.pruneDescriptions) {
					const descOverride = rule?.descriptions?.[origKey];
					if (descOverride !== undefined && "description" in (transformedProp as Record<string, unknown>)) {
						transformedProp = { ...(transformedProp as Record<string, unknown>), description: descOverride };
					}
				}
				if (transformedProp !== rawProp) propsChanged = true;
			}
			nextProps[wireKey] = transformedProp;
		}
		if (propsChanged) ensureCopy().properties = nextProps;
	}

	if (Array.isArray(node.required)) {
		let reqChanged = false;
		const nextReq = node.required.map(entry => {
			if (typeof entry !== "string") return entry;
			const wireKey =
				ctx.isRoot && ctx.encodeIntent && entry === INTENT_FIELD ? WIRE_INTENT_FIELD : (rule?.keys?.[entry] ?? entry);
			if (wireKey !== entry) reqChanged = true;
			return wireKey;
		});
		if (reqChanged) ensureCopy().required = nextReq;
	}

	if (isRecord(node.items)) {
		let nextItems = transformSchemaNode(
			node.items,
			rule,
			{ ...ctx, isRoot: false },
			enumMap,
			undefined,
		);
		if (overrideItemDesc !== undefined && "description" in nextItems && !ctx.pruneDescriptions) {
			nextItems = { ...nextItems, description: overrideItemDesc };
		}
		if (nextItems !== node.items) ensureCopy().items = nextItems;
	} else if (Array.isArray(node.items)) {
		let arrChanged = false;
		const nextItems = node.items.map(item => {
			if (!isRecord(item)) return item;
			const next = transformSchemaNode(item, rule, { ...ctx, isRoot: false }, enumMap, undefined);
			if (next !== item) arrChanged = true;
			return next;
		});
		if (arrChanged) ensureCopy().items = nextItems;
	}

	if (Array.isArray(node.prefixItems)) {
		let arrChanged = false;
		const nextPrefix = node.prefixItems.map(item => {
			if (!isRecord(item)) return item;
			const next = transformSchemaNode(item, rule, { ...ctx, isRoot: false }, enumMap, undefined);
			if (next !== item) arrChanged = true;
			return next;
		});
		if (arrChanged) ensureCopy().prefixItems = nextPrefix;
	}

	for (const combinator of ["anyOf", "oneOf", "allOf"] as const) {
		const branches = node[combinator];
		if (!Array.isArray(branches)) continue;
		let changed = false;
		const nextBranches = branches.map(branch => {
			if (!isRecord(branch)) return branch;
			const next = transformSchemaNode(branch, rule, ctx, enumMap, overrideItemDesc);
			if (next !== branch) changed = true;
			return next;
		});
		if (changed) ensureCopy()[combinator] = nextBranches;
	}

	if (isRecord(node.not)) {
		const nextNot = transformSchemaNode(node.not, rule, ctx, enumMap, overrideItemDesc);
		if (nextNot !== node.not) ensureCopy().not = nextNot;
	}

	return copy ?? node;
}

/** Encode canonical tool arguments (and optionally root `INTENT_FIELD`) to Wire keys/enums. */
export function encodeWireToolArguments(
	canonicalToolName: string,
	args: Record<string, unknown>,
	options: { encodeIntent?: boolean } = {},
): Record<string, unknown> {
	const canonicalName = decodeWireToolName(canonicalToolName);
	const rule = OBJECT_CODEC_RULES[canonicalName];
	const encodeIntent = options.encodeIntent ?? true;
	if (!rule && !(encodeIntent && INTENT_FIELD in args)) return args;
	return encodeArgumentsNode(args, rule, encodeIntent, true);
}

function encodeArgumentsNode(
	obj: Record<string, unknown>,
	rule: ObjectCodecRule | undefined,
	encodeIntent: boolean,
	isRoot: boolean,
): Record<string, unknown> {
	let changed = false;
	const next: Record<string, unknown> = {};
	for (const [origKey, origVal] of Object.entries(obj)) {
		let wireKey = origKey;
		if (isRoot && encodeIntent && origKey === INTENT_FIELD && !(WIRE_INTENT_FIELD in obj)) {
			wireKey = WIRE_INTENT_FIELD;
		} else if (rule?.keys?.[origKey] !== undefined) {
			const mapped = rule.keys[origKey]!;
			if (!(mapped in obj)) wireKey = mapped;
		}
		if (wireKey !== origKey) changed = true;

		let wireVal = origVal;
		const enumMap = rule?.enums?.[origKey];
		if (enumMap && typeof origVal === "string" && enumMap[origVal] !== undefined) {
			wireVal = enumMap[origVal]!;
		} else {
			const childRule = rule?.children?.[origKey];
			if (childRule) {
				if (Array.isArray(origVal)) {
					let arrChanged = false;
					const mappedArr = origVal.map(item => {
						if (!isRecord(item)) return item;
						const nextItem = encodeArgumentsNode(item, childRule, false, false);
						if (nextItem !== item) arrChanged = true;
						return nextItem;
					});
					if (arrChanged) wireVal = mappedArr;
				} else if (isRecord(origVal)) {
					wireVal = encodeArgumentsNode(origVal, childRule, false, false);
				}
			}
		}
		if (wireVal !== origVal) changed = true;
		next[wireKey] = wireVal;
	}
	return changed ? next : obj;
}

/** Rewrite illustrative `ToolExample` call objects for a tool before prompt formatting. */
export function encodeWireExamples<TArgs extends Record<string, unknown>>(
	canonicalToolName: string,
	examples: readonly ToolExample<TArgs>[] | undefined,
): readonly ToolExample<TArgs>[] | undefined {
	if (!examples || examples.length === 0) return examples;
	const canonicalName = decodeWireToolName(canonicalToolName);
	if (!OBJECT_CODEC_RULES[canonicalName]) return examples;
	let changed = false;
	const encoded = examples.map(ex => {
		if ("call" in ex) {
			const nextCall = encodeWireToolArguments(canonicalName, ex.call, { encodeIntent: false }) as TArgs;
			if (nextCall !== ex.call) {
				changed = true;
				return { ...ex, call: nextCall };
			}
			return ex;
		}
		if ("bad" in ex && "good" in ex) {
			const nextBad = encodeWireToolArguments(canonicalName, ex.bad, { encodeIntent: false }) as TArgs;
			const nextGood = encodeWireToolArguments(canonicalName, ex.good, { encodeIntent: false }) as TArgs;
			if (nextBad !== ex.bad || nextGood !== ex.good) {
				changed = true;
				return { ...ex, bad: nextBad, good: nextGood };
			}
			return ex;
		}
		return ex;
	});
	return changed ? encoded : examples;
}

export interface DecodeWireArgumentsOptions {
	/** Translate root `summary` (`WIRE_INTENT_FIELD`) -> `i` (`INTENT_FIELD`). */
	decodeIntent?: boolean;
	/** Canonical schema natively defines a `summary` parameter (prevents intent collision). */
	canonicalDefinesSummary?: boolean;
}

/** Decode Wire tool arguments back to canonical tool parameter names and enum values. */
export function decodeWireToolArguments(
	toolName: string,
	args: Record<string, unknown>,
	options: DecodeWireArgumentsOptions = {},
): Record<string, unknown> {
	const canonicalName = decodeWireToolName(toolName);
	const rule = INVERTED_CODEC_RULES[canonicalName];
	const decodeIntent =
		Boolean(options.decodeIntent) &&
		!options.canonicalDefinesSummary &&
		WIRE_INTENT_FIELD in args &&
		!(INTENT_FIELD in args);
	if (!rule && !decodeIntent) return args;
	return decodeArgumentsNode(args, rule, decodeIntent, true);
}

function decodeArgumentsNode(
	obj: Record<string, unknown>,
	rule: InvertedObjectRule | undefined,
	decodeIntent: boolean,
	isRoot: boolean,
): Record<string, unknown> {
	let changed = false;
	const next: Record<string, unknown> = {};
	for (const [wireKey, wireVal] of Object.entries(obj)) {
		let canonicalKey = wireKey;
		if (isRoot && decodeIntent && wireKey === WIRE_INTENT_FIELD && !(INTENT_FIELD in obj)) {
			canonicalKey = INTENT_FIELD;
		} else if (rule?.keys[wireKey] !== undefined) {
			const mapped = rule.keys[wireKey]!;
			if (!(mapped in obj)) canonicalKey = mapped;
		}
		if (canonicalKey !== wireKey) changed = true;

		let canonicalVal = wireVal;
		const enumMap = rule?.enums[canonicalKey];
		if (enumMap && typeof wireVal === "string" && enumMap[wireVal] !== undefined) {
			canonicalVal = enumMap[wireVal]!;
		} else {
			const childRule = rule?.children[canonicalKey];
			if (childRule) {
				if (Array.isArray(wireVal)) {
					let arrChanged = false;
					const mappedArr = wireVal.map(item => {
						if (!isRecord(item)) return item;
						const nextItem = decodeArgumentsNode(item, childRule, false, false);
						if (nextItem !== item) arrChanged = true;
						return nextItem;
					});
					if (arrChanged) canonicalVal = mappedArr;
				} else if (isRecord(wireVal)) {
					canonicalVal = decodeArgumentsNode(wireVal, childRule, false, false);
				}
			}
		}
		if (canonicalVal !== wireVal) changed = true;
		next[canonicalKey] = canonicalVal;
	}
	return changed ? next : obj;
}

type ToolCallBlock = Extract<AssistantMessage["content"][number], { type: "toolCall" }> & StreamingPartialJsonCarrier;

function copyStreamingSymbols(target: ToolCallBlock, source: ToolCallBlock): void {
	const partialJson = getStreamingPartialJson(source);
	if (partialJson !== undefined) setStreamingPartialJson(target, partialJson);
	copyCursorExecResolved(target, source);
}

const nativeFieldSchemaCache = new WeakMap<object, Map<string, boolean>>();

function toolNativelyDefinesField(tool: AgentTool | undefined, field: string): boolean {
	if (!tool) return false;
	const params = toolWireSchema(tool);
	if (!params || typeof params !== "object") return false;
	let perSchema = nativeFieldSchemaCache.get(params);
	const cached = perSchema?.get(field);
	if (cached !== undefined) return cached;
	const defines = schemaDefinesProperty(params, field);
	if (!perSchema) {
		perSchema = new Map();
		nativeFieldSchemaCache.set(params, perSchema);
	}
	perSchema.set(field, defines);
	return defines;
}

const canonicalToolsIndexCache = new WeakMap<readonly AgentTool[], ReadonlyMap<string, AgentTool>>();

/** Build a lookup of canonical tools for collision-free Wire decoding, memoized per array identity. */
export function indexCanonicalTools(tools: readonly AgentTool[] | undefined): ReadonlyMap<string, AgentTool> | undefined {
	if (!tools || tools.length === 0) return undefined;
	const cached = canonicalToolsIndexCache.get(tools);
	if (cached) return cached;
	const map = new Map<string, AgentTool>();
	for (const tool of tools) {
		if (!map.has(tool.name)) map.set(tool.name, tool);
	}
	canonicalToolsIndexCache.set(tools, map);
	return map;
}

export interface DecodeWireStreamOptions {
	intentTracing?: boolean;
	toolsByName?: ReadonlyMap<string, AgentTool>;
}

/** Decode a single incoming Wire `ToolCall` block back into canonical form, preserving streaming metadata. */
export function decodeWireToolCall(block: ToolCallBlock, options: DecodeWireStreamOptions = {}): ToolCallBlock {
	const canonicalName = decodeWireToolName(block.name);
	const tool = options.toolsByName?.get(canonicalName);
	const rawArgs = isRecord(block.arguments) ? block.arguments : {};
	const decodeIntent = Boolean(options.intentTracing) && !toolNativelyDefinesField(tool, INTENT_FIELD);
	const decodedArgs = decodeWireToolArguments(canonicalName, rawArgs, {
		decodeIntent,
		canonicalDefinesSummary: toolNativelyDefinesField(tool, WIRE_INTENT_FIELD),
	});
	if (canonicalName === block.name && decodedArgs === block.arguments) return block;
	const decoded: ToolCallBlock = {
		...block,
		name: canonicalName,
		arguments: decodedArgs,
	};
	copyStreamingSymbols(decoded, block);
	return decoded;
}

function decodeAssistantMessage(message: AssistantMessage, options: DecodeWireStreamOptions): AssistantMessage {
	let contentChanged = false;
	const nextContent = message.content.map(block => {
		if (block.type !== "toolCall") return block;
		const decoded = decodeWireToolCall(block as ToolCallBlock, options);
		if (decoded !== block) contentChanged = true;
		return decoded;
	});
	return contentChanged ? { ...message, content: nextContent } : message;
}

function decodeStreamEvent(event: AssistantMessageEvent, options: DecodeWireStreamOptions): AssistantMessageEvent {
	switch (event.type) {
		case "start":
		case "text_start":
		case "text_delta":
		case "text_end":
		case "thinking_start":
		case "thinking_delta":
		case "thinking_end":
		case "image_end":
		case "toolcall_start":
		case "toolcall_delta": {
			const decodedPartial = decodeAssistantMessage(event.partial, options);
			return decodedPartial === event.partial ? event : { ...event, partial: decodedPartial };
		}
		case "toolcall_end": {
			const decodedPartial = decodeAssistantMessage(event.partial, options);
			const decodedCall = decodeWireToolCall(event.toolCall as ToolCallBlock, options);
			return decodedPartial === event.partial && decodedCall === event.toolCall
				? event
				: { ...event, partial: decodedPartial, toolCall: decodedCall };
		}
		case "done": {
			const decodedMessage = decodeAssistantMessage(event.message, options);
			return decodedMessage === event.message ? event : { ...event, message: decodedMessage };
		}
		case "error": {
			const decodedError = decodeAssistantMessage(event.error, options);
			return decodedError === event.error ? event : { ...event, error: decodedError };
		}
	}
}

/**
 * Wrap an inbound `AssistantMessageEventStream` with a lightweight iterator/result proxy
 * so every streamed and terminal `toolCall` is decoded transparently without detaching
 * iterator cleanup (`return()`/`throw()`) or final `.result()` timing.
 */
export function decodeWireAssistantStream(
	inner: AssistantMessageEventStream,
	options: DecodeWireStreamOptions = {},
): AssistantMessageEventStream {
	const proxy: Pick<AssistantMessageEventStream, "result" | typeof Symbol.asyncIterator> = {
		[Symbol.asyncIterator](): AsyncIterator<AssistantMessageEvent> {
			const innerIter = inner[Symbol.asyncIterator]();
			const decodeResult = (step: IteratorResult<AssistantMessageEvent>): IteratorResult<AssistantMessageEvent> =>
				step.done ? step : { done: false, value: decodeStreamEvent(step.value, options) };
			return {
				next: () => innerIter.next().then(decodeResult),
				...(innerIter.return ? { return: value => innerIter.return!(value).then(decodeResult) } : {}),
				...(innerIter.throw ? { throw: err => innerIter.throw!(err).then(decodeResult) } : {}),
			};
		},
		async result(): Promise<AssistantMessage> {
			return decodeAssistantMessage(await inner.result(), options);
		},
	};
	return proxy as AssistantMessageEventStream;
}

function encodeWireAssistantMessage(
	message: AssistantMessage,
	toolsByName: ReadonlyMap<string, AgentTool> | undefined,
): AssistantMessage {
	let contentChanged = false;
	const nextContent = message.content.map(block => {
		if (block.type !== "toolCall") return block;
		const canonicalName = decodeWireToolName(block.name);
		const wireName = block.customWireName ? block.name : encodeWireToolName(canonicalName);
		const rawArgs = isRecord(block.arguments) ? block.arguments : {};
		const tool = toolsByName?.get(canonicalName);
		const nativeSummary = toolNativelyDefinesField(tool, WIRE_INTENT_FIELD);
		const nativeIntent = toolNativelyDefinesField(tool, INTENT_FIELD);
		const nextArgs = encodeWireToolArguments(canonicalName, rawArgs, {
			encodeIntent: !nativeSummary && !nativeIntent,
		});
		if (wireName === block.name && nextArgs === block.arguments) return block;
		contentChanged = true;
		const cloned: ToolCallBlock = { ...block, name: wireName, arguments: nextArgs };
		copyStreamingSymbols(cloned, block as ToolCallBlock);
		return cloned;
	});
	return contentChanged ? { ...message, content: nextContent } : message;
}

const wireMessageMemo = new WeakMap<object, { version: number; toolsKey: object | undefined; encoded: Message }>();

/** Encode canonical provider-level `Message[]` (`toolCall` and `toolResult` names/arguments) for the wire. */
export function encodeWireMessages(
	messages: Message[],
	toolsByName?: ReadonlyMap<string, AgentTool>,
): Message[] {
	let changed = false;
	const encoded = messages.map(msg => {
		if (msg.role === "assistant") {
			const version = messageEstimateVersion(msg as AgentMessage);
			const cached = wireMessageMemo.get(msg);
			if (cached && cached.version === version && cached.toolsKey === toolsByName) {
				if (cached.encoded !== msg) changed = true;
				return cached.encoded;
			}
			const nextMsg = encodeWireAssistantMessage(msg, toolsByName);
			wireMessageMemo.set(msg, { version, toolsKey: toolsByName, encoded: nextMsg });
			if (nextMsg !== msg) changed = true;
			return nextMsg;
		}
		if (msg.role === "toolResult") {
			const wireToolName = encodeWireToolName(decodeWireToolName(msg.toolName));
			if (wireToolName === msg.toolName) return msg;
			changed = true;
			return { ...msg, toolName: wireToolName };
		}
		return msg;
	});
	return changed ? encoded : messages;
}
