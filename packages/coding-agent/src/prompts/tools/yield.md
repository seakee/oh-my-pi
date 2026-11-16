{{#if workPoolItems}}Submit one workpool item at a time as `{ key, data }` or `{ key, error }`: `key` is its 1-based number, `data` is the self-contained outcome or evidence value, and `error` is a failure reason. The result tells you which keys remain, and the final key ends the turn automatically. Do not submit several items together.
{{else}}Submit subagent output as `{ data: <your output> }` on success or `{ error: "message" }` on failure. Never send both, and never send a bare payload outside `data`.

Omit `type` for the usual single terminal structured result. Pass `type: ["section"]` to submit an incremental, non-terminal section that accumulates.
{{/if}}
{{#unless workPoolItems}}
{{#if hasOutputSchema}}
This task declares an output schema, so the terminal `data` must be the full object matching it. A data-less `type: "result"` finalizes the incremental sections you already submitted and is invalid when there are none; prose in your last turn can never satisfy the schema.
{{else}}
Pass `type: "result"` to finalize; when you omit `data`, your last assistant turn becomes the raw final result.
{{/if}}
{{/unless}}
