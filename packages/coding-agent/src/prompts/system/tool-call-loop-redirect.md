<system-interrupt reason="tool_call_loop_detected">
You called `{{tool_name}}` {{count}} times in a row with identical arguments:
`{{arguments_summary}}`

Last result (truncated): `{{result_summary}}`

Do not call `{{tool_name}}` with those arguments again this turn. Use different arguments, choose another tool, or summarize your findings and finish if the work is complete.
</system-interrupt>
