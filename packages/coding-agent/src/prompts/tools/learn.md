Capture reusable lessons in long-term memory, and optionally mint or enhance a managed skill in the same call.

Use it after solving something likely to pay off again: a non-obvious fix, a discovered project convention, or a workflow that worked.

{{#if globalScope}}`scope: global` stores a lesson in the shared bank that every project recalls; reserve it for cross-project lessons.
{{/if}}`skill` is optional; provide it only for a repeatable procedure worth codifying as `SKILL.md`, not for a fact. Managed skills live in an isolated `~/.omp/agent/managed-skills` directory, surface as normal skills next session, and never touch user-authored skills. Frontmatter is generated from `name` and `description`.

Capture sparingly and specifically: one strong reusable lesson beats several vague ones.
