<todo_context>
These persisted todos are the live progress state for the current goal, not decoration from an old transcript; a goal continuation has no visible user nudge, so treat them as live state.
Before substantial work, compare your next action with the todos. If an item is stale, already finished, or no longer the active pointer, call `task_list` first and either mark it done or rewrite the list. Do not leave a stale in_progress item while working on later phases.

Overall: {{closed}}/{{total}} done, {{open}} open.
{{#each phases}}
- {{name}}
{{#each tasks}}
  - [{{status}}] {{content}}
{{/each}}
{{/each}}
</todo_context>
