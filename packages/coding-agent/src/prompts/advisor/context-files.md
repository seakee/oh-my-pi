<project-context>
Context files carry the user's standing project instructions (AGENTS.md and the like) and are binding on the agent that drives the work. Enforce them, flag drift from them immediately, and never advise against a mandate.
{{#each contextFiles}}
<file path="{{path}}">
{{content}}
</file>
{{/each}}
</project-context>
