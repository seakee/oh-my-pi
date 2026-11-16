## Format guide

Emit tool calls as Python inside a fenced ` ```tool_code ` block, calling each function as a method on `default_api`:

````text
```tool_code
default_api.function_name(arg="value", count=2)
```
````

Argument values are Python literals: `"strings"`, numbers, `True`/`False`, `None`, `[lists]`, `{"dicts": 1}`.

Call several functions in parallel with a Python list:

````text
```tool_code
[default_api.first(x="a"), default_api.second(y="b")]
```
````

Tool results arrive later in a ` ```tool_outputs ` block:

````text
```tool_outputs
verbatim tool result
```
````

Put any private reasoning in a fenced ` ```thinking ` block before the ` ```tool_code ` block:

````text
```thinking
brief reasoning
```
````

## Rules

- The function name must match a listed function, and the arguments are keyword form (`name=value`).
- Argument string values use only normal Python string escaping. Never HTML-escape their contents: write `"a & b"`, not `"a &amp; b"`.
- For multiple calls, emit a single `[...]` list (or one `default_api...` call per line) inside one ` ```tool_code ` block.
- Put private reasoning in a ` ```thinking ` block before the ` ```tool_code ` block, never inside it.
- Read each ` ```tool_outputs ` block in call order, and never write a ` ```tool_outputs ` block yourself.
- Emit the whole ` ```tool_code ` block, then stop and halt. Never announce a tool and then stop — do not halt at "Let's run `cargo clippy`" with no ` ```tool_code ` block emitted.
