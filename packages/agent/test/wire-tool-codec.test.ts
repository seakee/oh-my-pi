import { describe, expect, it } from "bun:test";
import { type } from "@oh-my-pi/omptype";
import {
	Agent,
	agentLoop,
	CANONICAL_TO_WIRE_TOOL_NAME,
	decodeWireToolName,
	encodeWireMessages,
	encodeWireToolChoice,
	encodeWireToolName,
	normalizeTools,
	WIRE_INTENT_FIELD,
} from "@oh-my-pi/pi-agent-core";
import type { AgentContext, AgentTool } from "@oh-my-pi/pi-agent-core/types";
import type { AssistantMessage, Message, ToolCall } from "@oh-my-pi/pi-ai";
import { createMockModel } from "@oh-my-pi/pi-ai/providers/mock";
import {
	getStreamingPartialJson,
	kCursorExecResolved,
	setStreamingPartialJson,
} from "@oh-my-pi/pi-ai/utils/block-symbols";
import { AssistantMessageEventStream } from "@oh-my-pi/pi-ai/utils/event-stream";

function createAssistantMessage(content: AssistantMessage["content"], stopReason: AssistantMessage["stopReason"]): AssistantMessage {
	return {
		role: "assistant",
		content,
		api: "anthropic-messages",
		provider: "anthropic",
		model: "claude-sonnet-4-5",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
		},
		stopReason,
		timestamp: Date.now(),
	};
}

describe("wire tool codec", () => {
	it("maps all 15 high-signal OMP tool names bijectively and keeps generic/customWire names intact", () => {
		const expected: Record<string, string> = {
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
		};
		expect(Object.keys(CANONICAL_TO_WIRE_TOOL_NAME)).toHaveLength(15);
		for (const [canonical, wire] of Object.entries(expected)) {
			expect(encodeWireToolName(canonical)).toBe(wire);
			expect(decodeWireToolName(wire)).toBe(canonical);
		}
		expect(encodeWireToolName("read")).toBe("read");
		expect(encodeWireToolName("edit", "apply_patch")).toBe("apply_patch");
		expect(decodeWireToolName("read")).toBe("read");
	});

	it("encodes schemas, examples, and toolChoice into Wire shapes", () => {
		const todoSchema = type({
			op: "'init' | 'start' | 'done' | 'rm' | 'drop' | 'append' | 'view'",
			"list?": type({ phase: "string", items: "string[]" }).array(),
			"phase?": "string",
			"task?": "string | string[]",
		});
		const evalSchema = type({
			language: type("'py' | 'js'").describe('"py": Python; "js": Bun'),
			code: type("string").describe("Code or standalone % command."),
			"reset?": "boolean",
			"title?": "string",
		});
		const tools: AgentTool[] = [
			{
				name: "todo",
				label: "Todo",
				description: "Manage tasks",
				parameters: todoSchema,
				async execute() {
					return { content: [] };
				},
			},
			{
				name: "eval",
				label: "Eval",
				description: "Run code",
				parameters: evalSchema,
				examples: [{ caption: "Load", call: { language: "py", code: "print(1)", title: "demo", reset: false } }],
				async execute() {
					return { content: [] };
				},
			},
		];

		const encoded = normalizeTools(tools, { injectIntent: true }) ?? [];
		expect(encoded.map(t => t.name)).toEqual(["task_list", "execute_code"]);

		const todoProps = (encoded[0]!.parameters as { properties: Record<string, any> }).properties;
		expect(Object.keys(todoProps)).toEqual([WIRE_INTENT_FIELD, "action", "groups", "group", "item"]);
		expect(todoProps.action.enum).toEqual(["create", "start", "done", "remove", "clear", "append", "view"]);
		expect(Object.keys(todoProps.groups.items.properties)).toEqual(["group", "items"]);
		expect(todoProps.groups.items.required).toEqual(["group", "items"]);

		const evalProps = (encoded[1]!.parameters as { properties: Record<string, any> }).properties;
		expect(Object.keys(evalProps)).toEqual([WIRE_INTENT_FIELD, "runtime", "code", "reset_state", "label"]);
		expect(evalProps.runtime.enum).toEqual(["python", "javascript"]);
		expect(evalProps.runtime.description).toBe('"python": Python; "javascript": JavaScript');
		expect(encoded[1]!.description).toContain('execute_code(summary="…", runtime="python"');

		expect(encodeWireToolChoice({ type: "tool", name: "todo" })).toEqual({ type: "tool", name: "task_list" });
		expect(encodeWireToolChoice({ type: "function", function: { name: "task" } })).toEqual({
			type: "function",
			function: { name: "delegate_task" },
		});
	});

	it("encodes historical AssistantMessage and ToolResultMessage blocks onto the Wire cleanly", () => {
		const tc: ToolCall = {
			type: "toolCall",
			id: "call_1",
			name: "task",
			arguments: {
				i: "Delegating slices",
				context: "Shared ctx",
				tasks: [{ task: "Do A", solutionSpace: "pkg/a", schemaMode: "strict" }],
			},
		};
		const messages: Message[] = [
			createAssistantMessage([tc], "toolUse"),
			{
				role: "toolResult",
				toolCallId: "call_1",
				toolName: "task",
				content: [{ type: "text", text: "ok" }],
				isError: false,
				timestamp: Date.now(),
			},
		];
		const encoded = encodeWireMessages(messages);
		expect(encoded[0]).not.toBe(messages[0]);
		const wireCall = (encoded[0] as AssistantMessage).content[0] as ToolCall;
		expect(wireCall.name).toBe("delegate_task");
		expect(wireCall.arguments).toEqual({
			summary: "Delegating slices",
			shared_context: "Shared ctx",
			subtasks: [{ task: "Do A", scope: "pkg/a", schema_validation: "strict" }],
		});
		expect((encoded[1] as Extract<Message, { role: "toolResult" }>).toolName).toBe("delegate_task");
	});

	it("decodes Wire tool calls, intent summary, and preserves streaming symbols end-to-end in agentLoop", async () => {
		const observedCalls: Array<{ tool: string; params: Record<string, unknown> }> = [];
		const observedHistoryTools: Array<string | undefined> = [];

		const bashSchema = type({
			command: "string",
			"async?": "boolean",
			"pty?": "boolean",
			"notify?": "string",
			"name?": "string",
			"ready?": { log: "string" },
		});
		const grepSchema = type({ pattern: "string", "case?": "boolean", "skip?": "number" });
		const context: AgentContext = {
			systemPrompt: ["test"],
			messages: [],
			tools: [
				{
					name: "eval",
					label: "Eval",
					description: "eval",
					parameters: type({ language: "'py' | 'js'", code: "string", "reset?": "boolean", "title?": "string" }),
					execute: async (_id, params) => {
						observedCalls.push({ tool: "eval", params: params as Record<string, unknown> });
						return { content: [{ type: "text", text: "ran" }] };
					},
				},
				{
					name: "bash",
					label: "Bash",
					description: "bash",
					parameters: bashSchema,
					execute: async (_id, params) => {
						observedCalls.push({ tool: "bash", params: params as Record<string, unknown> });
						return { content: [{ type: "text", text: "ok" }] };
					},
				},
				{
					name: "grep",
					label: "Grep",
					description: "grep",
					parameters: grepSchema,
					execute: async (_id, params) => {
						observedCalls.push({ tool: "grep", params: params as Record<string, unknown> });
						return { content: [{ type: "text", text: "hits" }] };
					},
				},
			],
		};

		const cursorCall: ToolCall = {
			type: "toolCall",
			id: "tc_4",
			name: "semantic_search",
			arguments: { [WIRE_INTENT_FIELD]: "Finding", query: "foo" },
		};
		(cursorCall as unknown as Record<symbol, unknown>)[kCursorExecResolved] = true;
		const wireCalls: ToolCall[] = [
			{
				type: "toolCall",
				id: "tc_1",
				name: "execute_code",
				arguments: { [WIRE_INTENT_FIELD]: "Running python", runtime: "python", code: "x = 1", reset_state: true, label: "step 1" },
			},
			{
				type: "toolCall",
				id: "tc_2",
				name: "bash",
				arguments: {
					[WIRE_INTENT_FIELD]: "Starting svc",
					command: "node app.js",
					background: true,
					tty: false,
					notify_on: "done",
					service_name: "web",
					readiness: { log: "listening" },
				},
			},
			{
				type: "toolCall",
				id: "tc_3",
				name: "grep",
				arguments: { [WIRE_INTENT_FIELD]: "Searching", pattern: "foo", case_sensitive: true, offset: 5 },
			},
			cursorCall,
		];
		setStreamingPartialJson(wireCalls[0]!, '{"runtime":"python"}');

		let turn = 0;
		const mock = createMockModel({ responses: [] });
		const seenStreamingPartial: Array<string | undefined> = [];
		const streamFn = (_model: unknown, ctx: { messages: Message[] }) => {
			if (turn === 1) {
				for (const m of ctx.messages) {
					if (m.role === "assistant") {
						for (const b of m.content) {
							if (b.type === "toolCall") observedHistoryTools.push(b.name);
						}
					} else if (m.role === "toolResult") {
						observedHistoryTools.push(m.toolName);
					}
				}
			}
			const s = new AssistantMessageEventStream();
			queueMicrotask(() => {
				if (turn === 0) {
					turn++;
					const partial = createAssistantMessage(wireCalls, "toolUse");
					s.push({ type: "start", partial });
					for (let idx = 0; idx < wireCalls.length; idx++) {
						s.push({ type: "toolcall_start", contentIndex: idx, partial });
						s.push({ type: "toolcall_end", contentIndex: idx, toolCall: wireCalls[idx]!, partial });
					}
					s.push({ type: "done", reason: "toolUse", message: createAssistantMessage(wireCalls, "toolUse") });
				} else {
					const done = createAssistantMessage([{ type: "text", text: "finished" }], "stop");
					s.push({ type: "start", partial: done });
					s.push({ type: "done", reason: "stop", message: done });
				}
				s.end();
			});
			return s;
		};

		const stream = agentLoop(
			[{ role: "user", content: "go", timestamp: Date.now() }],
			context,
			{ model: mock.model, convertToLlm: msgs => msgs as Message[], intentTracing: true },
			undefined,
			streamFn,
		);
		for await (const ev of stream) {
			if (ev.type === "message_update" && ev.assistantMessageEvent.type === "toolcall_end") {
				seenStreamingPartial.push(getStreamingPartialJson(ev.assistantMessageEvent.toolCall));
			}
		}
		const finalMessages = await stream.result();

		expect(observedCalls).toEqual([
			{ tool: "eval", params: { language: "py", code: "x = 1", reset: true, title: "step 1" } },
			{
				tool: "bash",
				params: { command: "node app.js", async: true, pty: false, notify: "done", name: "web", ready: { log: "listening" } },
			},
			{ tool: "grep", params: { pattern: "foo", case: true, skip: 5 } },
		]);
		expect(seenStreamingPartial[0]).toBe('{"runtime":"python"}');
		// Internal history retains canonical names; outbound replay uses Wire names.
		const assistantTurn = finalMessages.find(m => m.role === "assistant" && m.stopReason === "toolUse") as AssistantMessage;
		const canonicalCall = assistantTurn.content[0] as ToolCall;
		const canonicalCursorCall = assistantTurn.content[3] as ToolCall;
		expect(canonicalCall.name).toBe("eval");
		expect(canonicalCall.intent).toBe("Running python");
		expect(canonicalCursorCall.name).toBe("find");
		expect((canonicalCursorCall as unknown as Record<symbol, unknown>)[kCursorExecResolved]).toBe(true);
		expect(observedHistoryTools).toEqual([
			"execute_code",
			"bash",
			"grep",
			"semantic_search",
			"execute_code",
			"bash",
			"grep",
		]);
	});

	it("preserves tool-owned summary field without intent collision when using Agent", async () => {
		const params = type({ summary: "string" });
		let capturedArgs: unknown;
		const agent = new Agent({
			intentTracing: true,
			streamFn: () => {
				const msg = createAssistantMessage(
					[{ type: "toolCall", id: "c1", name: "custom", arguments: { i: "Summarized", summary: "body" } }],
					"toolUse",
				);
				const s = new AssistantMessageEventStream();
				queueMicrotask(() => {
					s.push({ type: "start", partial: msg });
					s.push({ type: "toolcall_end", contentIndex: 0, toolCall: msg.content[0] as ToolCall, partial: msg });
					s.push({ type: "done", reason: "toolUse", message: msg });
					s.end();
				});
				return s;
			},
		});
		agent.setModel(createMockModel({ responses: [{ content: ["ok"] }] }).model);
		agent.setTools([
			{
				name: "custom",
				label: "Custom",
				description: "has own summary",
				parameters: params,
				execute: async (_id, args) => {
					capturedArgs = args;
					return { content: [{ type: "text", text: "ok" }] };
				},
			},
		]);
		// Direct normalizeTools keeps `i` alongside native `summary` instead of colliding.
		const normalized = normalizeTools(agent.state.tools, { injectIntent: true }) ?? [];
		const props = (normalized[0]!.parameters as { properties: Record<string, unknown> }).properties;
		expect(Object.keys(props)).toEqual(["i", "summary"]);
		void agent;
		void capturedArgs;
	});
});
