## MCP Tool Routes

{{#if tools.length}}
Execute each mounted tool by writing JSON arguments to its path.{{#if hasCatalogOnlyTools}} A path with a summary also reports its documentation and JSON schema when you call `read` on it.{{/if}}
{{#each tools}}
- {{mcpToolName}} → `{{path}}`{{#if summary}} — {{summary}}{{/if}}
{{/each}}
{{/if}}
{{#if hasOmittedTools}}
Additional mounted MCP tool mappings are omitted here to keep the prompt bounded. Inspect `xd://` for the exact current paths.
{{/if}}
