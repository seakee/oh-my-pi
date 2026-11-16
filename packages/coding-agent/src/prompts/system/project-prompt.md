<project-context>
<workstation>
{{#list environment prefix="- " join="\n"}}{{label}}: {{value}}{{/list}}
{{#if model}}- Model: {{model}}{{/if}}
</workstation>

{{#if contextFiles.length}}
<repo-rules>
Apply the following user and project instructions throughout the task.
{{#each contextFiles}}
<file path="{{path}}">
{{content}}
</file>
{{/each}}
</repo-rules>
{{/if}}

{{#if agentsMdSearch.files.length}}
<dir-context>
Read the applicable files below before changing their directories. More specific directory rules take precedence over broader ones.
{{#list agentsMdSearch.files join="\n"}}- {{this}}{{/list}}
</dir-context>
{{/if}}

{{#ifAny contextFiles.length agentsMdSearch.files.length}}
Relevant instruction files have already been discovered and supplied above. Do not search for additional `AGENTS.md`, `CLAUDE.md`, `.cursorrules` or similar context files.
{{/ifAny}}

{{#if includeWorkspaceTree}}
{{#if workspaceTree.rendered}}
<workspace-tree>
This directory outline is ordered by recent modification time and shows up to three levels.
{{workspaceTree.rendered}}
{{#if workspaceTree.truncated}}
{{#has tools "glob"}}{{#has tools "read"}}The outline omits some entries. Inspect the relevant directories with `{{toolRefs.glob}}` and `{{toolRefs.read}}` as needed.{{/has}}{{/has}}
{{/if}}
</workspace-tree>
{{/if}}
{{/if}}
{{#if additionalWorkspaceRoots.length}}
<workspace-roots>
These are the currently available additional working directories; use this list instead of older workspace descriptions in the conversation. {{#ifAny (includes tools "read") (includes tools "grep") (includes tools "glob") (includes tools "edit")}}For resources under them, pass absolute paths to {{#has tools "read"}}`{{toolRefs.read}}`{{/has}}{{#has tools "grep"}}{{#ifAny (includes tools "read")}}/{{/ifAny}}`{{toolRefs.grep}}`{{/has}}{{#has tools "glob"}}{{#ifAny (includes tools "read") (includes tools "grep")}}/{{/ifAny}}`{{toolRefs.glob}}`{{/has}}{{#has tools "edit"}}{{#ifAny (includes tools "read") (includes tools "grep") (includes tools "glob")}}/{{/ifAny}}`{{toolRefs.edit}}`{{/has}}.{{/ifAny}} The `/add-dir`, `/remove-dir` and `/dirs` commands manage and list these locations.
{{#each additionalWorkspaceRoots}}
- {{this}}
{{/each}}
</workspace-roots>
{{/if}}
{{#if activeRepoContext}}
{{activeRepoContext}}
{{/if}}
</project-context>

Continue with the next useful task action until the requested outcome is complete. Resolve ordinary uncertainty using the available tools and project information instead of unnecessary confirmation questions.
{{#if subagent}}
Return your completed changes to the coordinating agent for verification. Do not run verification yourself unless the assignment explicitly requests it.
{{else}}
Before reporting a significant behavior change as complete, exercise that behavior with the relevant command, test or scenario and inspect the result.
{{/if}}

{{#if appendPrompt}}
{{appendPrompt}}
{{/if}}
