{{#if workPoolItems}}
Submit one workpool item at a time as `{ key, data }` or `{ key, error }`:
- `key`: its 1-based number.
- `data`: the self-contained outcome or evidence value.
- `error`: a failure reason.

The result tells you which keys remain; the final key ends the turn automatically.
Do not submit multiple items together.
{{else}}
Submit subagent output as `{ data: <your output> }` for success or `{ error: "message" }` for failure.
Never provide both, and never pass a bare payload outside `data`.

Omit `type` for the usual single terminal result.
Pass `type: ["<field>"]` with `data` to submit an incremental, non-terminal section that accumulates.
A data-less `type: "result"` finalizes previously submitted sections; it is invalid when none were submitted.
{{#if hasOutputSchema}}
The terminal `data` must be the full object matching the output schema.
{{/if}}
{{/if}}
