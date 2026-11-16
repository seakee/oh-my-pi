One cell per call; top-level state persists, including across compaction.{{#if spawns}} Subagents have separate kernels.{{/if}}
{{#if spawns}}{{#if eagerDelegation}}For 2+ independent items use a named `workpool()`; results auto-deliver.{{#if waitTool}} If you are blocked, leave `eval` and call `wait`.{{/if}}{{/if}}{{/if}}
{{#if py}}Python cells run as a plain Python subprocess, not IPython: no `get_ipython()`, `obj?`, or `%matplotlib`. Magics such as `%pip`, `%load`, `%time`, and `!cmd` are rewritten to Python. Top-level `await` works; `asyncio.run(…)` fails.{{/if}}
{{#if js}}JS cells run on Bun (`Bun.file`, `Bun.write`, `Bun.$`); top-level `await` and `return` work.{{/if}}
After an error, retry only the failed step; earlier steps may already have taken effect.
Printing an image{{#if py}} or figure{{/if}} attaches it.

<prelude>
{{#ifAll py js}}Python helpers are synchronous and take keyword arguments; JS helpers are async and take ONE trailing options object.{{else}}{{#if py}}Helpers are synchronous and take keyword arguments.{{/if}}{{#if js}}Helpers are async and take ONE trailing options object.{{/if}}{{/ifAll}}
```
print(value, ...)  log(message)  phase(title)
read(path, offset?, limit?)  write(path, content)  env(key?, value?)  output(*ids, format?, query?, offset?, limit?)
{{#if js}}await {{/if}}tool.<name>(args) — session tool; `args` is its parameter object
wait(handles, timeout?=None, raise_errors?=True) — agent/completion barrier, ordered results{{#if js}}; JS: wait(handles, { timeout, raiseErrors }){{/if}}; `raise_errors=False` retains failures.
```
</prelude>

{{#if inlineTopics}}
{{{inlineTopics}}}
{{else}}
<namespaces>
These globals are documented separately; call `read` on the linked page before using one:
- `judge`, `{{#if py}}judge_batch{{else}}judgeBatch{{/if}}`, `completion`: classification, bulk judgment, model calls → `xd://eval/judge`
- `%load`{{#if py}}, `%pip`{{/if}}{{#if js}}, `%bun add`{{/if}}, `budget`{{#if evalTools}}, `@tool`/`tool(fn)`{{/if}}: setup, installs, utilities → `xd://eval/helpers`
{{#if spawns}}
- `agent`, `workpool`: background subagents, DAG waves → `xd://eval/agents`
{{/if}}
{{#each preludes}}
- `{{name}}`: {{summary}} → `xd://eval/{{name}}`
{{/each}}
</namespaces>
{{/if}}

## Rules

Do not repeat setup that already succeeded. A kernel-loss notice means reload it.

{{#if autoBackgroundEnabled}}Long cells may move to the background and deliver later while the kernel stays busy. `timeout: 0` disables the cell deadline, not the foreground wait.{{/if}}
