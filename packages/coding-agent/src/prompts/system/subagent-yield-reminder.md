{{#if budgetStop}}
{{#if structured}}
<system-reminder>
The request budget is spent, so the in-flight turn stopped and you must wrap up now. Call `submit_output` immediately with the best final report you can make from completed work.

- Consolidate everything you gathered; mark remaining gaps as incomplete instead of investigating further.
- Do not call another tool or resume the assignment.
- Terminal `submit_output` only: put the report in `data` and omit `type`.
</system-reminder>
{{else}}
<system-reminder>
The request budget is spent, so the in-flight turn stopped and you must wrap up now. Tools are disabled. Reply immediately with the best final report you can make from completed work; this message is your result.

- Consolidate everything you gathered; mark remaining gaps as incomplete instead of investigating further.
</system-reminder>
{{/if}}
{{else}}
<system-reminder>
Your last turn had no tool call, so the session went idle. Reminder {{retryCount}} of {{maxRetries}}.

Every turn should end with a tool call. Take the first option that applies:
1. **Resume work** — the assignment is incomplete and you are not recording an incremental section: call the next intended tool (edit, write, bash, search, and so on). This reminder is not a forced stop.
2. **Submit an incremental section** — only if it is useful: call `submit_output` with a non-empty `type: string[]`; matching sections accumulate and the task continues.
3. **Submit success** — only when the work is genuinely complete: a terminal `submit_output` carrying the report in `data`, with `type` omitted.
4. **Submit an error** — only for a real, concrete, nameable blocker (a missing file, an unavailable API, a contradictory spec): describe what you attempted and the exact blocker. Never invent a "forced immediate-submit" or "system reminder required termination" reason; a reminder is not a blocker.

Option 1 is the default unless the work is done, blocked, or ready for an incremental section.

Never end this turn with text alone.
</system-reminder>
{{/if}}
