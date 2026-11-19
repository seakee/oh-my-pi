Structural code search for when syntax shape matters more than text: calls, declarations, language constructs.

## Usage

- Keep each call to one language. `pat` is a single AST pattern, so unrelated patterns need separate calls.
- Set `lang` when extension inference is ambiguous (for example `cpp` for `.h`); `.cu` and `.cuh` infer as C++.
- `$NAME` captures one node, `$_` matches without binding, `$$$NAME` matches zero or more, and `$$$` matches zero or more without binding.
  - Write `$$$NAME`, not `$$NAME`, which is invalid. Names are uppercase and cover a whole node, so `prefix$VAR` fails.
- Repeating a metavariable requires identical code (`$A == $A` matches `x == x`, not `x == y`).
- A pattern must parse as a single AST node. Wrap one that is not standalone: `class $_ { … }`.
- C++ call expressions need a trailing `;` as statements: `ns::doThing($ARG);`, `$CALLEE($ARG);`.
- TypeScript annotations are tolerated: `async function $NAME($$$ARGS): $_ { $$$BODY }`.
- Declaration forms differ (`function foo`, a method `foo()`, `const foo = () => {}`), so search the right form before concluding a symbol is absent.
- The loosest existence check is `pat: "executeBash"` with a narrow `path`.

## Rules

- Do not scan from the repository root; narrow `path` first.
- A parse issue is a query failure, not an absence: fix the pattern or tighten `path` before concluding there are no matches.
{{#if eagerDelegation}}- Broad cross-subsystem exploration goes to a {{#if scoutAvailable}}subagent with `scout`{{else}}subagent{{/if}} first.{{/if}}
