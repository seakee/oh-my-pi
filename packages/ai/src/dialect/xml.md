## Format guide

A call is one `<invoke>` element whose `<parameter>` children carry its arguments:

```text
<invoke name="fn"><parameter name="arg">value</parameter></invoke>
```

For multiple calls, emit consecutive `<invoke>...</invoke>` blocks; you may wrap them in `<tool_calls>...</tool_calls>`. Each call's result arrives as a response block:

```text
<tool_response>
verbatim tool result
</tool_response>
```

## Rules

- `name` must match a listed function.
- Parameter values are read literally by regex delimiter matching, not by a real XML parser: write them verbatim and never HTML-escape them (emit `a & b`, never `a &amp; b`, and keep `<` and `>` literal too). Only the body's own `</parameter>` closing tag is reserved. Non-string values are JSON; add `string="false"` to a parameter only to force JSON parsing of a value that the schema treats as a string.
- Read each `<tool_response>` in call order, and never emit `<tool_response>` yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<invoke>` emitted. Write the complete call, then the stop sequence, then halt.
