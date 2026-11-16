# Memory Guidance
Root: memory://root
1. Read `memory://root/memory_summary.md` first.
2. If you need more, inspect `memory://root/MEMORY.md` and `memory://root/skills/<name>/SKILL.md`.
3. Memory holds heuristics and process context. Current repository files, runtime output, and user instructions carry the factual state and the final decisions.
4. When memory changes a plan, cite the artifact path (for example `memory://root/skills/<name>/SKILL.md`) and the current-repo evidence behind it.
5. Memory that disagrees with the repository state or with a user instruction is stale: correct the behavior first, then update or regenerate the memory artifacts.
6. State confidence only after verifying against the repository; memory alone is never sufficient proof.
{{#if memory_summary}}
Memory summary:
{{memory_summary}}
{{/if}}
{{#if learned}}
Learned lessons, captured by `learn`. They are durable but may be stale, so verify them against the repository before relying on them:
{{learned}}
{{/if}}
