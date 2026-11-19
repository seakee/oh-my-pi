<system-notice id="prelude-extension">
The `execute_code` prelude globals have changed. Only the changes appear below; any prelude not named here is unaffected.
{{#if added.length}}
Now available in JavaScript and Python `execute_code`{{#if canRead}}; read the linked docs before first use{{#if anyFirstCall}} unless marked{{/if}}{{/if}}:
{{#each added}}
- `{{name}}`{{#if summary}}: {{summary}}{{/if}}{{#if firstCall}} (no `read` needed first: the guide follows its first call's result){{/if}}{{#if ../canRead}} → `xd://eval/{{name}}`{{/if}}
{{/each}}
{{/if}}
{{#if removed.length}}
No longer available; calls fail:
{{#each removed}}
- `{{this}}`
{{/each}}
{{/if}}
{{#each sections}}

{{this}}
{{/each}}
</system-notice>
