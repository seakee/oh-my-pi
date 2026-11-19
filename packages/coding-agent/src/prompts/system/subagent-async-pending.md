Your `submit_output` was recorded, and {{count}} background job{{#if multiple}}s{{/if}} you own {{#if multiple}}are{{else}}is{{/if}} still running: {{jobs}}.

{{#if workPool}}
This run completes once they settle. If a job is no longer needed, write `proc://<id>/kill` with empty `content` to cancel it.
{{else}}
This run completes only after the jobs settle and you submit a fresh `submit_output` that accounts for their results. Job results arrive as follow-up messages, and a result that arrives after your `submit_output` supersedes it; it is not accepted as the final report. Decide now:
- Job no longer needed? Write `proc://<id>/kill` with empty `content` to cancel it, then call `submit_output` again.
- Otherwise stand by. As each result arrives, submit a fresh `submit_output` that incorporates it (repeat the report unchanged if the result does not affect it).
{{/if}}
