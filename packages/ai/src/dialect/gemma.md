## Format guide

Emit each tool call as one `<|tool_call>` block. The body is `call:NAME{key:value,...}`, and every string value is wrapped in the `<|"|>` token:

```text
<|tool_call>call:function_name{path:<|"|>src/a.ts<|"|>,count:2}<tool_call|>
```

Non-string values are bare: numbers (`2`), `true`/`false`, `null`, lists `[<|"|>a<|"|>,<|"|>b<|"|>]`, and nested objects `{k:<|"|>v<|"|>}`.

Tool results arrive later in matching `<|tool_response>` blocks:

```text
<|tool_response>response:function_name{output:<|"|>verbatim result<|"|>}<tool_response|>
```

You may optionally precede tool calls with private reasoning in a `<|channel>thought` block, closed by `<channel|>`:

```text
<|channel>thought
brief reasoning
<channel|>
```

## Rules

- `NAME` must match a listed function, and the arguments are `key:value` pairs separated by commas.
- String values between `<|"|>` tokens are raw literal text with no escaping. Never HTML-escape them: write `a & b`, not `a &amp; b`.
- For multiple calls, emit consecutive `<|tool_call>...<tool_call|>` blocks and keep prose outside them.
- The closer is `<tool_call|>`, with the pipe on the right — not `</tool_call>` and not `<|tool_call>`.
- Private reasoning goes in a `<|channel>thought…<channel|>` block before any call; never put tool calls inside it.
- Read each `<|tool_response>` block in call order, and never write a `<|tool_response>` block yourself.
- Write each call in full, then stop and halt. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<|tool_call>` block emitted.
