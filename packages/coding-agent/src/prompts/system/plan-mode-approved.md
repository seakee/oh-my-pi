Plan approved.
{{#if contextPreserved}}
- The history is still usable; where it conflicts with the plan below, the plan wins.
{{/if}}

The full plan is inlined below, with a durable copy at `{{planFilePath}}` (identical content). Execute the plan step by step with full tool access, and verify each step before moving to the next. Do not re-read `{{planFilePath}}` while the inline plan is intact; the path is for subagent handoff and recovery only.
{{#has tools "todo"}}
Before execution, initialize todo tracking with `task_list`.
After each completed step, update `task_list` immediately.
If `task_list` fails, fix the payload and retry before continuing.
{{/has}}

<plan path="{{planFilePath}}">
{{planContent}}
</plan>

If the inline plan is compressed, expired, or unrecoverable, do not stop: read `{{planFilePath}}`. If that read fails, report the exact path and error; never guess. Keep working until the plan is complete.
