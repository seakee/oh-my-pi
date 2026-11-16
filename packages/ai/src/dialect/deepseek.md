## Format guide

A tool call wraps the function name, a separator, and one JSON object of arguments in fixed tokens. Emit them exactly:

```text
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>tool_name<｜tool▁sep｜>{"arg":"value"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>
```

Results arrive as output tokens:

```text
<｜tool▁output▁begin｜>verbatim tool result<｜tool▁output▁end｜>
```

## Rules

- Use `｜` (U+FF5C) and `▁` (U+2581) exactly.
- The tool name must match an available function, and the arguments are one valid JSON object.
- Argument string values use only normal JSON string escaping (`\"`, `\\`, `\n`). Never HTML-escape their contents: write `a & b`, not `a &amp; b`.
- Never wrap arguments in Markdown fences, and never emit a `type` field or a `function` prefix.
- To make multiple calls, chain `<｜tool▁call▁begin｜>...<｜tool▁call▁end｜>` directly, with no separators, spaces, or newlines between them.
- When private reasoning is needed, put it in `<think>...</think>` before the tokens.
- Read each output token in call order, and never emit output tokens yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<｜tool▁call▁begin｜>` emitted. Write the complete call, then the stop sequence, then halt.
