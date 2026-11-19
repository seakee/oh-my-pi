<system-notice id="skills">
Skills changed during this session. Read the relevant `skill://<name>` before acting on a task covered by a matching skill. This notice lists only what changed; any skill not named here is unaffected.
{{#if added.length}}
Now available:
{{#each added}}
- {{name}}: {{description}}
{{/each}}
{{/if}}
{{#if updated.length}}
Updated (this description replaces the earlier one):
{{#each updated}}
- {{name}}: {{description}}
{{/each}}
{{/if}}
{{#if removed.length}}
No longer available:
{{#each removed}}
- `{{this}}`
{{/each}}
{{/if}}
</system-notice>
