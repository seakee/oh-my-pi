Symbol-aware code intelligence from language servers: navigation, refactors, and diagnostics where text tools miss callsites.

## Operations

- Position-based: `file` + `line` + `symbol` (a substring, with `#N` for the Nth match). `line` is 1-indexed.
- `rename` applies by default; `apply: false` previews. Project-aware lookups error without `symbol` rather than falling back silently on missing or ambiguous matches.
- `code_actions` lists by default; apply one with `apply: true` and `query` (a title substring or an index).
- `rename_file` moves the file and rewrites every import and reference; it applies by default.
- `diagnostics` takes a path, a glob (`src/**/*.ts`), or `file: "*"` for the workspace.
- `symbols`: `file` lists that file's symbols; `file: "*"` with `query` searches the workspace.
- `reload` restarts one server (`file`) or all of them (`*`); `reload *` re-reads the LSP config.
- `request` sends a raw request: `query` is the method and `payload` the JSON params (otherwise they are built automatically).

## Timeout

The whole call defaults to {{defaultTimeoutSec}}s, and project-aware diagnostics wait {{defaultWaitSec}}s. `timeout` sets both for this call: raise it for a server that is still indexing or cold-starting, lower it to fail fast. It is capped at {{maxTimeoutSec}}s.

## Rules

- Symbol-aware work (rename, references, definition, code actions) must use `lsp` whenever a server is available, because it follows shadowing, re-exports, and cross-file usages that text tools miss.
- Never do a cross-file rename with `ast_edit`, `sed`, or hand edits when `lsp` `rename`/`rename_file` can: text renames silently drop callsites.
- Reach for `code_actions` on imports, quick fixes, and server-known refactors before editing by hand.
