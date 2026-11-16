Prepare to execute the approved plan.

Distil the plan-mode discussion.
Preserve:
- The plan rationale and the alternatives you explicitly rejected.
- Key decisions and the constraints that drove them.
- Discovered files, symbols, and code paths the executor needs.
- User preferences expressed during planning.

Drop:
- Tool-call noise (file reads, searches) whose result is captured in the plan or the plan-mode discussion.
- Superseded plan drafts.
- Context the plan file already restates.

{{#if planFilePath}}
Approved plan file: `{{planFilePath}}`, the authoritative source of truth. Preserve this durable path; the plan body is re-inlined for the executor after compaction, so never restate it in the summary.
{{/if}}
