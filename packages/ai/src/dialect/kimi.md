## Format guide

Emit every call of a turn inside one section. Each call is an id of the fixed form `functions.NAME:INDEX` followed by one JSON arguments object:

```text
<|tool_calls_section_begin|><|tool_call_begin|>functions.NAME:INDEX<|tool_call_argument_begin|>{"arg":"value"}<|tool_call_end|><|tool_calls_section_end|>
```

Tool results arrive later as turns whose body is a `## Return of functions.NAME:INDEX` header followed by the verbatim result:

```text
<|im_system|>NAME<|im_middle|>## Return of functions.NAME:INDEX
verbatim tool result<|im_end|>
```

## Rules

- `NAME` must match a listed function exactly.
- The arguments must be one JSON object with double-quoted keys.
- Argument string values use only normal JSON string escaping (`\"`, `\\`, `\n`). Never HTML-escape their contents: write `a & b`, not `a &amp; b`.
- For multiple calls, emit consecutive `<|tool_call_begin|>...<|tool_call_end|>` blocks in the same section, with `INDEX` incrementing from `0`.
- When supported, private reasoning goes in `<think>...</think>` before the tool-call section; never put tool calls inside `<think>`.
- Read each result turn in call order, and never emit result turns yourself.
- Emit the stop sequence only after the call is fully written. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no `<|tool_call_begin|>` emitted. Write the complete call, then the stop sequence, then halt.
