## Code Review Request

Mode: custom instructions.
{{#if repository}}

Repository: `{{repository}}` — not the session cwd; the reviewer must run version-control commands there and resolve `read` paths against it.
{{/if}}

## Distribution

Use `delegate_task` with a `subtasks` array. Set `agent: "reviewer"` inside the `subtasks[]` item (`subtasks[].agent`), never at the top level and never omitted. Create exactly **1 reviewer task**, and the assignment must include the custom instructions.

## Reviewer Instructions

The reviewer:
1. Follows the custom instructions.
2. Reads the referenced files and workspace context needed to evaluate them.
3. Uses incremental `submit_output` sections for findings and verdict fields; it does not call a separate finding tool.

## Custom Instructions

{{instructions}}
