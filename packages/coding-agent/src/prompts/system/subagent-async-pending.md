Your `yield` was recorded, and {{count}} background job{{#if multiple}}s{{/if}} you own {{#if multiple}}are{{else}}is{{/if}} still running: {{jobs}}.

This run completes only after the jobs settle and you submit a fresh `yield` that accounts for their results. Job results arrive as follow-up messages, and a result that arrives after your `yield` supersedes it; it is not accepted as the final report. Decide now:
- Job no longer needed? Write `proc://<id>/kill` without `content` to cancel it, then yield again.
- Otherwise stand by. As each result arrives, submit a fresh `yield` that incorporates it (repeat the report unchanged if the result does not affect it).
