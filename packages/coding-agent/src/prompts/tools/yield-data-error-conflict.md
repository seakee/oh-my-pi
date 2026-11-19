{{#if isWorkPool}}A workpool output takes exactly one of `data` or `error` (received error {{{errorJson}}}).

Resubmit exactly one outcome, keeping the same `key`:
- For success, resend `{"key":{{workPoolKey}},"data":<your output>}`.
- For failure, resend only `{{{failureJson}}}`.
{{else}}An output cannot contain both `data` and `error` (received error {{{errorJson}}}).

Resubmit exactly one outcome:
- For success, resend the same payload without `error`, keeping the same `type` if you sent one: {{#if typeJson}}`{"type":{{{typeJson}}},"data":<your output>}`{{else}}`{"data":<your output>}`{{/if}}.
- For failure, resend only `{{{failureJson}}}`.
{{/if}}
