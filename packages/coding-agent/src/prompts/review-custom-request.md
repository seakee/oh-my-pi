## Code Review Request

Mode: custom instructions.

## Distribution

Use `task` with a `tasks` array. Set `agent: "reviewer"` inside the `tasks[]` item (`tasks[].agent`), never at the top level and never omitted. Create exactly **1 reviewer task**, and the assignment must include the custom instructions.

## Reviewer Instructions

The reviewer:
1. Follows the custom instructions.
2. Reads the referenced files and workspace context needed to evaluate them.
3. Uses incremental `yield` sections for findings and verdict fields; it does not call a separate finding tool.

## Custom Instructions

{{instructions}}
