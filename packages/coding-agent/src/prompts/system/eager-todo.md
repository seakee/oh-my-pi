<system-reminder>
{{#if forced}}
Create a phased todo before substantive work.

Call `{{toolRefs.todo}}` first in this turn. This forced call is the one exception to `{{toolRefs.todo}}` never taking a turn of its own; later updates go alongside real tool calls.
Initialize the todo list with a single `init` op.
Cover the entire request from investigation through implementation and verification, not just the next immediate step.
Keep task descriptions concise, specific labels of 5-10 words.
The `init` op accepts only phase names and task-label strings; do not invent task metadata fields.

After `{{toolRefs.todo}}` succeeds, continue the request in the same turn. Do not call `{{toolRefs.todo}}` again unless the task state has materially changed.
{{else}}
Consider calling `{{toolRefs.todo}}` first to lay out a phased plan with a single `init` op. A good list covers the whole request (investigation through implementation and verification, not just the next step) with specific task descriptions that a future turn could execute without re-planning.
Keep each task a concise, specific label of 5-10 words; the `init` op accepts only phase names and task-label strings, so do not invent extra task metadata fields.
If you create the list, continue the request in the same turn and avoid calling `{{toolRefs.todo}}` again unless the task state materially changes.
{{/if}}
</system-reminder>
