{{#if forReviewer}}

## Operator-Supplied Review Focus

Validate every annotation against the diff and the surrounding code. Never repeat an operator note without independently confirming it.
{{else}}

## Code Review Annotations

Treat these annotations as review notes rather than independently validated findings.
{{/if}}

{{#list annotations join="\n\n"}}

{{#if isLine}}

### {{pathLabel}} — {{lineLabel}}

{{else}}

### {{pathLabel}} — file

{{/if}}

Path: `{{path}}`
{{#if oldPath}}
Old path: `{{oldPath}}`
{{/if}}
{{#if newPath}}
New path: `{{newPath}}`
{{/if}}
Occurrence: `{{occurrence}}`

{{#if isLine}}
Hunk: `{{hunkHeader}}`

{{#codeblock lang="diff"}}
{{rawLine}}
{{/codeblock}}
{{/if}}

{{note}}
{{/list}}
{{#if supplementalInstructions}}

## Supplemental Review Focus

{{supplementalInstructions}}
{{/if}}
