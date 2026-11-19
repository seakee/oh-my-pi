```
{{#if py}}
agent(prompt, *, agent?="{{spawnDefaultAgent}}", label?=None, schema?=None, schema_mode?=None, isolated?=None, apply?=None, merge?=None{{#if evalTools}}, tools?=None{{/if}}{{#if perCallModel}}, model?=None{{/if}}) → AgentHandle
{{else}}
await agent(prompt, { agent?, label?, schema?, schemaMode?, isolated?, apply?, merge?{{#if evalTools}}, tools?{{/if}}{{#if perCallModel}}, model?{{/if}} }) → AgentHandle
{{/if}}
  Spawns a background subagent and returns immediately.
  - `agent` selects a discovered agent; omit it to use `{{spawnDefaultAgent}}`.{{#if spawnAllowedAgentsText}} Allowed agents: {{spawnAllowedAgentsText}}.{{/if}}
  - Handle: `.id`, `.handle` ("agent://<id>"), {{#if py}}`.status`{{else}}`.status()`{{/if}}, `.done()`, `.wait(timeout?)` → final text (parsed with `schema`),
    `.send(message)`, `.cancel()`, `.output()`.
  - Unawaited results auto-deliver like async jobs.
{{#if perCallModel}}
  - `model`: one exact `provider/model-id[@upstream][:level]` string for this call only.
    - `@upstream` pins an aggregator route and is part of the model identity.
    - Only operator-approved models are allowed; no roles, arrays, globs, or partial IDs.
    - Approved: {{#list perCallModelAdvertisement.roles join=", "}}{{#list patterns join=", "}}`{{this}}`{{/list}} ({{role}}){{/list}}{{#if perCallModelAdvertisement.roles.length}}; {{/if}}{{#if perCallModelAdvertisement.parentModelWithheld}}{{else}}your own current model; {{/if}}the selected bundled or user agent's own configured model.
    - A listed glob approves matching exact IDs; write the exact ID rather than the glob.
{{#if perCallModelAdvertisement.allowlist.length}}
    - Allowlist: {{#list perCallModelAdvertisement.allowlist join=", "}}`{{this}}`{{/list}} (must also be approved).
{{/if}}
    - An agent's `task.agentModelOverrides` entry or user-chosen effort conflicts with it.
    - If unavailable, stop and report rather than substituting another model.
    - Every request requires an approved model; retry fallback, context promotion, and prewalk are off.
{{/if}}
  - `schema` overrides agent and session schemas.
  - `{{#if py}}schema_mode{{else}}schemaMode{{/if}}`: `"permissive"` warns after retries, `"strict"` fails; omitted uses the session setting, else `"permissive"`.
  - `isolated` runs it in a worktree (requires `task.isolation.enabled`).
  - `{{#if py}}apply=False{{else}}apply: false{{/if}}` keeps its changes as patch/branch artifacts instead of applying them.
  - `{{#if py}}merge=False{{else}}merge: false{{/if}}` forces patch mode; otherwise `task.isolation.merge` decides.
{{#if evalTools}}
  - `tools`: names of tools you defined with {{#ifAll py js}}`@tool` / `tool(fn)`{{else}}{{#if py}}`@tool`{{else}}`tool(fn)`{{/if}}{{/ifAll}} that the child may call.
{{/if}}
{{#ifAll py js}}
  - Python: call without `await`; `await agent(…)` returns the final result rather than a handle (`await h` = `h.wait()`).
  - JS: ONE trailing object — `h = await agent(prompt, { agent, label, schema, schemaMode, isolated, apply, merge{{#if evalTools}}, tools{{/if}}{{#if perCallModel}}, model{{/if}} })`.
    - Without `await agent(…)`, `.id` and `.handle` are undefined.
    - Every handle method returns a Promise; `.status` is `await h.status()`.
{{else}}
{{#if js}}
  - Without `await agent(…)`, `.id` and `.handle` are undefined.
  - Every handle method returns a Promise.
{{/if}}
{{/ifAll}}
{{#if py}}
workpool(agent?=None, *, name?=None, context?=None{{#if evalTools}}, tools?=None{{/if}}{{#if perCallModel}}, model?=None{{/if}}) → WorkPool
{{else}}
await workpool(agent?, { name?, context?{{#if evalTools}}, tools?{{/if}}{{#if perCallModel}}, model?{{/if}} }) → WorkPool
{{/if}}
  {{#if eagerDelegation}}The default for 2+ independent items.{{else}}A keep-alive worker pool for a batch of independent items.{{/if}}
  - {{#if py}}`.push(*items)` (strings) → item ids; `.status()`; `.peek()`; `.close()`.{{else}}`await` each of `.push(...items)` (strings) → item ids, `.status()`, `.peek()`, `.close()`.{{/if}}
  - Pool name is the async job id; results auto-deliver.
  - The first full drain closes the pool: push the whole batch while it is active, and open a new pool for a later wave.
  - {{#if waitTool}}When completely blocked, leave `execute_code` and call the `await_jobs` tool (not runtime `wait()`); {{/if}}do not poll.
{{#if perCallModel}}
  - `model` selects each worker on its first turn; follow-ups reuse that session.
{{/if}}
{{#ifAll py js}}
  - JS: `pool = await workpool(agent, { name, context{{#if evalTools}}, tools{{/if}}{{#if perCallModel}}, model{{/if}} })`; `await` each pool method.
{{/ifAll}}
```

The cell `timeout` counts only the cell's own work, not waits on `agent()`/`wait()`/`tool.delegate_task(…)`, so a subagent can outlast it.

<dag>
Handles run in acyclic waves:
- **Name nodes.** `h = {{#if py}}agent(…)`{{#if js}} (JS: `await agent(…)`){{/if}}{{else}}await agent(…)`{{/if}} returns at once; `h.handle` is `agent://<id>`.
- **Wire edges.** Put an upstream `.wait()` result or `.handle` in the downstream prompt. For bulk data, use `write("local://<name>.md", …)`.
- **Kernel `{{#if py}}wait(hs)`{{#if js}} (JS: `await wait(hs)`){{/if}}{{else}}await wait(hs)`{{/if}}** acts as a wave barrier. Open-ended item streams belong in `workpool()`.
- **Isolate failure.** `{{#if py}}wait(hs, raise_errors=False)`{{#if js}} (JS: `await wait(hs, { raiseErrors: false })`){{/if}}{{else}}await wait(hs, { raiseErrors: false })`{{/if}} keeps a failure in its slot so only that subtree degrades.
- **Stay acyclic.** Do not feed an agent's handle or result back into one of its own upstream agents.
</dag>
