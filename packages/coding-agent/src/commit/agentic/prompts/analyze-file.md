Analyze {{file}}.

Goal:
{{#if goal}}
{{goal}}
{{else}}
Summarize the file's purpose and the commit-relevant changes.
{{/if}}

Return a concise JSON object:
- summary: a one-sentence description of the file's role.
- highlights: two to five bullets describing notable behaviors or changes.
- risks: edge cases or risks worth noting; an empty array if there are none.

{{#if related_files}}
## Other Files in This Change
{{related_files}}

Relate the file's changes to these files.
{{/if}}

Call the `yield` tool with the JSON payload.
