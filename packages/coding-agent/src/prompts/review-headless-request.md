## Code Review Request

Mode: headless review request.
{{#if repository}}

Repository: `{{repository}}` — not the session cwd; the reviewer must run version-control commands there and resolve `read` paths against it.
{{/if}}

Distribution: use `delegate_task` with a `subtasks` array. Set `agent: "reviewer"` inside the `subtasks[]` item (`subtasks[].agent`), never at the top level and never omitted. Create exactly **1 reviewer task** for the recent code changes.

{{#if focus}}
Focus: {{focus}}
{{/if}}
