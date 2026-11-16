## Code Review Request

Mode: headless review request.

Distribution: use `task` with a `tasks` array. Set `agent: "reviewer"` inside the `tasks[]` item (`tasks[].agent`), never at the top level and never omitted. Create exactly **1 reviewer task** for the recent code changes.

{{#if focus}}
Focus: {{focus}}
{{/if}}
