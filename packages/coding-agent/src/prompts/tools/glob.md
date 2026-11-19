Glob files and directories: `;`-separated paths or internal URLs (`local://*.md`); defaults to the workspace root.
`gitignore` and `hidden` both default to true, so ignored dotfiles need `gitignore: false`. Results list newest first within each directory, and directories end with `/`.
{{#ifAny eagerDelegation hasFind}}
{{#if hasFind}}Searching by behavior → `semantic_search`.{{/if}}
{{#if eagerDelegation}}Multi-round discovery → {{#if scoutAvailable}}`delegate_task` with `scout`{{else}}`delegate_task`{{/if}}.{{/if}}
{{/ifAny}}
