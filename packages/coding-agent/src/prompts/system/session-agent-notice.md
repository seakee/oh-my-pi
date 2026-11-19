<system-notice id="session-agents">
The model agents the user tags have changed. These `m<N>` pseudonyms are the `agent` names accepted by `delegate_task` and by `agent()`/`workpool()`, each pinned to the model the user tagged. Spawn one only when the user names it. Only the changes appear below; any pseudonym not named here is unaffected.
{{#if added.length}}
Now available:
{{#each added}}
- `{{name}}`: {{description}}
{{/each}}
{{/if}}
{{#if removed.length}}
No longer available; calls fail:
{{#each removed}}
- `{{this}}`
{{/each}}
{{/if}}
</system-notice>
