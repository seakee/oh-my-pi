## Format guide

Emit each call as a `<tool_call>` block wrapping a single-line JSON object with `name` and `arguments`:

```text
<tool_call>
{"name":"function_name","arguments":{"arg":"value"}}
</tool_call>
```

Results arrive later as `<tool_response>` blocks:

```text
<tool_response>
verbatim tool result
</tool_response>
```

## Rules

- `name` must match a listed function, and `arguments` is a JSON object, never a stringified JSON value.
- Argument string values use only normal JSON string escaping (`\"`, `\\`, `\n`). Never HTML-escape their contents: write `a & b`, not `a &amp; b`.
- Emit multiple calls as consecutive `<tool_call>` blocks, and keep any prose outside them.
- Read each `<tool_response>` in call order, and never emit `<tool_response>` yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<tool_call>` emitted. Write the complete call, then the stop sequence, then halt.
