Hashline patches. Use only the lines visible in the latest `read` or `search` result; elided lines are unseen.

```text
*** Begin Patch
[PATH#TAG]
PUT 3.=3:
+replacement
*** End Patch
```
`TAG` is the required 4-hex snapshot, and `N,M` are original line numbers. Repeat the header for each file.

Operations:
- `PUT N.=M:` replaces the inclusive range N–M with the `+` body; `PUT N*:` replaces the syntax block at N.
- `PUT <N:` inserts before N, `PUT >N:` inserts after N, and `PUT >$:` appends. `PUT >N*:` inserts after block N at sibling depth; to insert inside a block, use `PUT >M:` at its closing line.
- `CUT N.=M` and `CUT N*` delete and capture, optionally as `@name`.
- `PUT <N @name`, `PUT >N @name`, `PUT N.=M @name`, and `PUT N* @name` paste. A range or block paste needs a named register, while a gap paste may be anonymous. A register paste takes no body.
- `REM` deletes the file; `MV DEST` moves or renames it after the earlier section edits.

Rules:
- Body rows start with `+`, and a lone `+` writes a blank line. Everything else is verbatim, including indentation. Never send removed `-` lines, bare context, or unchanged lines. Range and body lengths are independent. For a literal leading `-` or `+`, write `+- text` or `++ text`.
- Re-read after each edit, because tags and line numbers change. Touch only the lines you changed, and split nonadjacent changes. Additions use gaps. A range never starts or ends mid-expression or mid-block.
- Block operations target the opener of one multi-line node, never its closer, last, or inner line; use a range or gap for a single statement. Anchor decorators, attributes, and doc comments at the first decorator, while a standalone line comment stays separate.
- A Markdown heading block includes deeper headings up to the next heading of the same or higher level, and an inserted section ends with a blank line.
- Move content with `CUT` and then `PUT`; registers persist across sections. Do not restyle unrelated code.
