## Format guide

Each function call is one assistant message on the `commentary` channel addressed to the function, emitted as text:

```text
<|start|>assistant<|channel|>commentary to=functions.function_name<|message|>{"arg":"value"}<|call|>
```

Put private reasoning in an `analysis` message:

```text
<|start|>assistant<|channel|>analysis<|message|>private reasoning<|end|>
```

Tool results arrive as messages authored by the function and addressed back to the assistant:

```text
<|start|>functions.function_name to=assistant<|channel|>commentary<|message|>verbatim tool result<|end|>
```

## Rules

- The recipient is `functions.` followed by a listed function name.
- The body is one JSON object matching the schema; omit optional arguments you are not setting.
- Argument string values use only normal JSON string escaping (`\"`, `\\`, `\n`). Never HTML-escape their contents: write `a & b`, not `a &amp; b`.
- Multiple calls are consecutive call messages.
- An optional visible preamble is a `commentary` message ending with `<|end|>`.
- Never put tool calls in `analysis`.
- Never wrap calls in Markdown or code fences.
- Read each tool-result message in call order, and never emit tool-result messages yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<|call|>` message emitted. Write the complete call, then the stop sequence, then halt.
