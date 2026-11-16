## Format guide

A call is a `<minimax:tool_call>` block wrapping one or more `<invoke>` blocks, each holding `<parameter>` children:

```text
<minimax:tool_call>
<invoke name="tool_name"><parameter name="arg_name">arg value</parameter></invoke>
</minimax:tool_call>
```

Results arrive later in a `<function_results>` block, one `<result>` per call (failures use `<error>` with `<stderr>` in place of `<result>` with `<stdout>`):

```text
<function_results>
<result>
<tool_name>tool_name</tool_name>
<stdout>verbatim tool result</stdout>
</result>
</function_results>
```

## Rules

- `name` must match a listed function.
- String and scalar parameters are exact text with spaces preserved. Their bodies are read by regex delimiter matching, not by a real XML parser, so never HTML-escape them: emit `a & b`, not `a &amp; b`, and keep `<` and `>` literal. Only the body's own `</parameter>` closing tag is reserved. Lists and objects are JSON.
- For multiple calls, emit multiple `<invoke>` blocks inside one `<minimax:tool_call>`.
- You may write visible text before the calls.
- Never emit `tool_calls` JSON.
- Never use `<function_calls>`, nor the legacy `<tool_name>`/`<parameters>` call syntax.
- Read each `<result>` or `<error>` in call order, and never emit `<function_results>` yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<invoke>` emitted. Write the complete call, then the stop sequence, then halt.
