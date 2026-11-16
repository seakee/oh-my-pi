## Format guide

Emit each tool call as one `<tool_call>` block wrapping a single-line JSON object with `name` and a nested `arguments` object:

```text
<tool_call>
{"name":"function_name","arguments":{"arg":"value"}}
</tool_call>
```

Do any private reasoning in `<think>...</think>` before your tool calls.

Tool results arrive later in a user turn:

```text
<tool_response>
verbatim tool result
</tool_response>
```

## Rules

- `name` must match a listed function, and `arguments` is a JSON object, never a JSON string.
- Argument string values use only normal JSON string escaping (`\"`, `\\`, `\n`). Never HTML-escape their contents: write `a & b`, not `a &amp; b`.
- For multiple calls, emit consecutive `<tool_call>...</tool_call>` blocks and keep prose outside them.
- Never put tool calls inside `<think>`.
- Read each `<tool_response>` in call order, and never emit `<tool_response>` yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<tool_call>` emitted. Write the complete call, then the stop sequence, then halt.
