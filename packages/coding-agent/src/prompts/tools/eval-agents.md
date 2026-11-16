```
agent(prompt, agent?="{{spawnDefaultAgent}}", label?=None, schema?=None, schema{{#if js}}Mode{{else}}_mode{{/if}}?="permissive", isolated?=None, apply?=None, merge?=None{{#if evalTools}}, tools?=None{{/if}}) → AgentHandle
    Spawns a background subagent and returns immediately. `agent` selects a discovered agent; omit it to use `{{spawnDefaultAgent}}`.{{#if spawnAllowedAgentsText}} Allowed agents: {{spawnAllowedAgentsText}}.{{/if}} The handle exposes `.id`, `.handle` ("agent://<id>"), `.status`, `.done()`, `.wait(timeout?)` → final text (parsed with `schema`), `.send(message)`, `.cancel()`, and `.output()`. An unawaited result auto-delivers like an async job. `schema` overrides the agent and session schemas; `isolated` requests a worktree; `apply`/`merge` decide what happens to its changes.{{#if evalTools}} `tools`: names of your @tool-defined tools the child may call.{{/if}}
{{#if js}}    JS: ONE trailing object — agent(prompt, { agent, label, schema, schemaMode, isolated, apply, merge{{#if evalTools}}, tools{{/if}} }).{{/if}}
workpool(agent?=None, name?=None, context?=None{{#if evalTools}}, tools?=None{{/if}}) → WorkPool
    {{#if eagerDelegation}}The default for 2+ independent items.{{else}}A keep-alive worker pool for a batch of independent items.{{/if}} `.push(*items)`; `.status()`; `.peek()`; `.close()`. The pool name is the async job ID, and results auto-deliver.{{#if waitTool}} Completely blocked? Leave `eval` and call `wait`;{{/if}} never poll. `eval.workpool.freshAgents=true` uses a new agent per item.
```

The cell `timeout` counts only the cell's own work, not waits on `agent()`/`wait()`/`tool.task(...)`, so a subagent can outlast it.

<dag>
Handles run in waves, and the graph stays acyclic:
- Name nodes: `h = agent(…)` returns at once, and `h.handle` is `agent://<id>`.
- Wire edges: put an upstream `.wait()` result or its `.handle` in the downstream prompt. For bulk data, `write("local://<name>.md", …)`.
- `wait(hs)` is the wave barrier. Open-ended item streams belong in `workpool()`.
- Isolate failure: `wait(hs, raise_errors=False)` keeps a failure in its slot, so only that subtree degrades.
- Stay acyclic: no node waits on its own descendant.
</dag>
