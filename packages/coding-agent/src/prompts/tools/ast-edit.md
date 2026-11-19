Structural AST-aware code rewrites for codemods where text replacement is unsafe. Mixed-language paths are fine: each file is parsed as its own language, and a pattern only rewrites the files it parses.

- Metavariables in `pat` (`$A`, `$$$ARGS`) substitute into `out`.
- Patterns match AST structure, not text. `$NAME` is one node, `$_` binds nothing, and `$$$NAME` is zero or more nodes.
  - Write `$$$NAME`, not `$$NAME`, which is invalid. Names are uppercase and cover a whole node, so a partial name such as `prefix$VAR` fails.
- Repeating a metavariable requires identical code (`$A == $A` matches `x == x`, not `x == y`).
- A rewrite pattern must parse as a single AST node. Wrap one that is not standalone: `class $_ { … }`.
- TypeScript annotations are tolerated: `async function $NAME($$$ARGS): $_ { $$$BODY }`. Delete a construct by leaving `out` empty: `{"pat":"console.log($$$)","out":""}`.
- Substitution is one to one: captures are never split or merged.
- Matches are staged as a preview proposal rather than applied immediately; follow the returned preview instructions to apply or discard them.
- A parse issue produces a malformed rewrite, not a clean no-op. For one-off text edits, prefer the edit tool.
