Glob files and directories: `;`-separated paths or internal URLs (`local://*.md`, `omp://**/*.md`); defaults to the workspace root.
`gitignore` and `hidden` both default to true, so ignored dotfiles need `gitignore: false`. Results list newest first within each directory, and directories end with `/`.
{{#ifAny eagerDelegation hasFind}}
{{#if hasFind}}Searching by behavior → `find`.{{/if}}
{{#if eagerDelegation}}Multi-round discovery → {{#if scoutAvailable}}Task with `scout`{{else}}Task{{/if}}.{{/if}}
{{/ifAny}}
