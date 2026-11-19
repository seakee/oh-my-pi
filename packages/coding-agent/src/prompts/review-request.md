## Code Review Request

### Mode

{{mode}}
{{#if repository}}

### Repository

`{{repository}}` — not the session cwd. File paths are relative to it; reviewers must run version-control commands there and resolve `read` paths against it.
{{/if}}

### Changed Files ({{len files}} files, +{{totalAdded}}/-{{totalRemoved}} lines)

{{#if files.length}}
{{#if prDiffUrl}}
Index is the file's 1-based position in the full PR diff; excluded files leave gaps. Assign each file with its exact Diff URL below.

{{#table files headers="Index|File|+/-|Type|Diff URL"}}
{{diffIndex}} | {{path}} | +{{linesAdded}}/-{{linesRemoved}} | {{ext}} | `{{diffUrl}}`
{{/table}}
{{else}}
{{#table files headers="File|+/-|Type"}}
{{path}} | +{{linesAdded}}/-{{linesRemoved}} | {{ext}}
{{/table}}
{{/if}}
{{else}}
_No files to review._
{{/if}}

{{#if excluded.length}}
### Excluded Files ({{len excluded}})

{{#list excluded prefix="- " join="\n"}}
`{{path}}` (+{{linesAdded}}/-{{linesRemoved}}) — {{reason}}
{{/list}}
{{/if}}

### Distribution Guidelines

Use the `delegate_task` tool with a `subtasks` array. Set `agent: "reviewer"` inside every `subtasks[]` item (`subtasks[].agent`), never at the top level and never omitted.
{{#when agentCount "==" 1}}Create exactly **1 reviewer task**.{{else}}Spawn **{{agentCount}} reviewer agents** in parallel.{{/when}}
{{#if multiAgent}}
Group the files by locality, for example:
- Same directory or module → same agent
- Related functionality → same agent
- Tests with their implementation files → same agent
{{/if}}

### Reviewer Instructions

The reviewer:
1. Focuses only on the files assigned to it.
2. {{#if skipDiff}}{{#if prDiffUrl}}Reads the assigned PR file diffs from the exact Diff URL in the Changed Files table or `{{prDiffUrl}}/all{{prDiffQuery}}`; it never uses local `git diff`/`git show` for PR diff content{{else}}{{#if diffInstruction}}{{diffInstruction}}{{else}}Runs `git diff`/`git show` for the assigned files{{/if}}{{/if}}{{else}}Uses the diff hunks below and never re-runs git diff{{/if}}
3. {{#if suppliedPatch}}Do not read workspace files for surrounding context because the supplied patch may come from a different checkout{{else}}{{#if prDiffUrl}}Obtain PR context from the fetched diff, its exact file URL or `{{prDiffUrl}}/all{{prDiffQuery}}`, not from local workspace files{{else}}{{#if contextInstruction}}{{contextInstruction}}{{else}}Read surrounding source with `read` when needed to assess the change{{/if}}{{/if}}{{/if}}
4. Uses incremental `submit_output` sections for findings and verdict fields; it does not call a separate finding tool.

{{#if skipDiff}}
### Diff Previews

_Full diff too large ({{len files}} files). Showing first ~{{linesPerFile}} lines per file._

{{#list files join="\n\n"}}
#### {{path}}

{{#codeblock lang="diff"}}
{{hunksPreview}}
{{/codeblock}}
{{/list}}
{{else}}

### Diff

<diff>
{{rawDiff}}
</diff>
{{/if}}

{{#if additionalInstructions}}
### Additional Instructions

{{additionalInstructions}}
{{/if}}
