<system-notice id="prelude-extension">
The `eval` prelude globals have changed. Only the changes appear below; any prelude not named here is unaffected.
{{#if added.length}}
Now available in the JavaScript and Python `eval`{{#if canRead}}; read the linked docs before first use{{/if}}:
{{#each added}}
- `{{name}}`{{#if summary}}: {{summary}}{{/if}}{{#if ../canRead}} → `xd://eval/{{name}}`{{/if}}
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
