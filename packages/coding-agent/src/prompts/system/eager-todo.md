<system-reminder>
{{#if forced}}
Create a phased todo before substantive work.

Call `{{toolRefs.todo}}` first in this turn. This forced call is the one exception to `{{toolRefs.todo}}` never taking a turn of its own; later updates go alongside real tool calls.
Initialize the list with a single `create` action.
Cover the entire request from investigation through implementation and verification, not just the next immediate step.
Keep item labels concise and specific (5-10 words).
The `create` action accepts only group names and task-label strings; do not invent item metadata fields.

After `{{toolRefs.todo}}` succeeds, continue the request in the same turn. Do not call `{{toolRefs.todo}}` again unless the task state has materially changed.
{{else}}
Consider calling `{{toolRefs.todo}}` first to lay out a grouped plan with a single `create` action. A good list covers the whole request (investigation through implementation and verification, not just the next step) with specific item descriptions that a future turn could execute without re-planning.
Keep each item a concise, specific label of 5-10 words; the `create` action accepts only group names and task-label strings, so do not invent extra item metadata fields.
If you create the list, continue the request in the same turn and avoid calling `{{toolRefs.todo}}` again unless the task state materially changes.
{{/if}}
</system-reminder>
