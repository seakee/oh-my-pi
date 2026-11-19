<system-reminder>
A classifier split this request into {{len subtasks}} subtasks that can run concurrently: items within a subtask are coupled, while different subtasks touch separate code.
{{#each subtasks}}

Subtask {{add @index 1}}:
{{#each this}}
- {{this}}
{{/each}}
{{/each}}
{{#if context}}

Context every subtask needs:
{{#each context}}
- {{this}}
{{/each}}
{{/if}}
{{#if wrapup}}

After every subtask finishes, handle directly:
{{#each wrapup}}
- {{this}}
{{/each}}
{{/if}}

Settle cross-subtask contracts first, then delegate the subtasks in a single parallel `{{taskTool}}` call, including the `shared_context` in each assignment. The split is an estimate: merge subtasks that turn out to be coupled, and do not split any subtask further.
</system-reminder>
