<system-notice>
Your turn is ending, and nothing is pending to wake you: no job, service, subagent, or queued message of yours is active. Until you act, these agents remain blocked on you:
{{#each waiters}}
- `{{id}}`, for {{ago}}: {{#if via}}blocked on you through {{#each via}}{{#unless @first}} → {{/unless}}`{{this}}`{{/each}}{{else}}{{#if ask}}asked "{{ask}}"{{#if promise}}; you promised "{{promise}}"{{/if}}{{else}}waiting for your next message{{/if}}{{/if}}
{{/each}}
Before ending your turn, handle each waiter in one of these ways:
- Complete the pending work now.
- If the work can start only after another condition holds (a run ends or time elapses), start an async `bash` job that waits for that condition, performs the work, and reports back so its completion wakes you. This is permitted because the rule against `sleep` jobs applies only to idle waiting, not to executing queued work.
- If you will not do it, notify the waiter to proceed without it (`write agent://<id>`).
</system-notice>
