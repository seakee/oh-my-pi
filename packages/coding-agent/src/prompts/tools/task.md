{{#if asyncEnabled}}
{{#if batchEnabled}}
Start `subtasks[]` concurrently and return their IDs immediately.
{{else}}
Start one agent and return its ID immediately.
{{/if}}
{{#if hasBlockingAgents}}
Blocking agents return inline.
{{/if}}
{{else}}
{{#if batchEnabled}}
Run `subtasks[]` synchronously.
{{else}}
Run one agent synchronously.
{{/if}}
{{/if}}
{{#if asyncEnabled}}
{{#ifAny structured hasStructuredAgents}}

## Results
{{#if structured}}`outputSchema`{{else}}Structured agents'{{/if}} parsed payload (even when invalid) is readable at `agent://<id>` (field `/<field>`, nested `/reports/0/data`), with an inline preview when invalid.
{{/ifAny}}

{{asyncGuidance}}
{{/if}}

## Inputs
- `agent`: choose the most specific agent{{#if batchEnabled}}, placed inside each `subtasks[]` item rather than at the top level{{/if}}.
  - Omit `agent` only for the default (`{{defaultAgent}}`); do not specify that default explicitly.
{{#if scoutAvailable}}
  - Use `scout` for read-only research only when the relevant files are unknown.
{{/if}}
  - Prefer one agent to both investigate and edit.
{{#if batchEnabled}}
- `shared_context`: shared background (`# Goal`, `# Contract` interfaces); do not repeat it per item.
{{/if}}
{{#if steps}}
- `steps`: ordered stages for one agent, sent one at a time after the prior stage finishes. Earlier stage reports arrive as progress messages; the last stage's result is returned.
  - The first step carries `# Target` files and non-goals{{#if batchEnabled}} beyond `shared_context`{{/if}}.
  - Each step covers one `# Change` stage.
  - The last step adds `# Acceptance` observable results.
  - Child agents start without this conversation;{{#if ircEnabled}} parent IRC steers immediately;{{/if}} pass large payloads via `local://<path>` rather than inline.
  - Independent work belongs in separate subtasks.
{{else}}
- `task`: self-contained assignment (`# Target` files and non-goals, `# Change` steps/APIs, `# Acceptance` observable results).
  - Child agents start without this conversation;{{#if ircEnabled}} parent IRC steers immediately;{{/if}} pass large payloads via `local://<path>` rather than inline.
{{/if}}
- `name`: CamelCase identifier up to 32 characters, auto-generated if omitted; address the agent by name.{{#if structured}} `outputSchema` overrides agent and session schemas.{{/if}}
- `scope`: describe how open-ended the child's problem is—whether the fix or design is already decided, or which causes or designs remain open.
  - Volume of work does not widen it; do not mention sibling agents or coordination.
  - Examples: `one fix: rename, names given`; `one fix: slice end in paginate`; `single-flight cache load; races easy to miss`; `several retry API shapes; error classes to choose`; `deadlock cause open, no repro`.
{{#if evalToolsEnabled}}
- `tools`: code-defined tools that execute in your runtime.
{{/if}}
{{#if effortEnabled}}
- `effort`: `"lo"`, `"med"`, or `"hi"` matching how open-ended the problem is.
{{/if}}
{{#if perCallModelEnabled}}
- `model`: one exact `provider/model-id[@upstream][:level]` string for this spawn only{{#if batchEnabled}}, set per `subtasks[]` item{{/if}}.
  - `@upstream` pins an aggregator route and is part of the model identity.
  - Only operator-approved models are allowed; no roles, arrays, globs, or partial IDs.
  - Approved models:
{{#each perCallModelAdvertisement.roles}}
    - {{#list patterns join=", "}}`{{this}}`{{/list}} ({{role}})
{{/each}}
{{#unless perCallModelAdvertisement.parentModelWithheld}}
    - your own current model
{{/unless}}
    - the selected bundled or user agent's own configured model
  - A listed glob approves matching exact IDs; write the exact ID rather than the glob.
{{#if perCallModelAdvertisement.allowlist.length}}
  - Allowlist: {{#list perCallModelAdvertisement.allowlist join=", "}}`{{this}}`{{/list}} (must also be approved).
{{/if}}
  - An agent's `task.agentModelOverrides` entry or user-chosen effort conflicts with `model`.
  - Omit `model` unless needed.
  - If a requested model is unavailable, stop and report rather than substituting another.
  - Every request requires an approved model; retry fallback, context promotion, and prewalk are off.
{{/if}}
{{#if structured}}
- `schema_validation`: default `permissive` warns after retries; `strict` fails.
{{/if}}
{{#if isolationEnabled}}
{{#if applyIsolatedChanges}}
- `isolated`: worktree execution whose successful changes apply to the parent.
{{else}}
- `isolated`: worktree execution whose changes are retained without being applied to the parent.
{{/if}}
{{/if}}

Shared edits require one integration owner; give each task its files{{#unless batchEnabled}} and interfaces{{/unless}}.
Subagents should skip builds, linters, tests, and formatters mid-flight so they can be run once afterward.

## Available agents
{{#if spawningDisabled}}Agent spawning is currently disabled.
{{else}}{{#if hasModelMentions}}`m<N>` refers to a user-tagged model (`<model agent="m<N>" name="…"/>`), not a specialist; spawn it only when the user names it.
{{/if}}{{#list agents join=""}}- `{{name}}`{{#if readOnly}} (read-only, no edits){{/if}}{{#if blocking}} (blocking; inline result){{/if}}{{#if structured}} (structured; schema result){{/if}}: {{description}}
{{/list}}{{/if}}
