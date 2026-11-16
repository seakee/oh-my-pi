<system-reminder>
Task delegation is enabled for this request, with subagents as the default.

First settle the approach: scope, top-level decomposition, cross-slice contracts. That part is your job, so never delegate the overall plan; per-slice design travels with each executor. Once it is settled, fan the work out to `{{toolRefs.task}}` subagents instead of implementing it yourself.{{#if taskBatch}} Batch independent slices into one parallel `{{toolRefs.task}}` call; never serialize work that can run concurrently.{{/if}}

Work alone when: the change is a single-file edit under about 30 lines, the answer needs no code changes, the user explicitly asked you to run a command, or there is only one runnable slice (a lone subagent means a lossy handoff, not parallelism).
</system-reminder>
