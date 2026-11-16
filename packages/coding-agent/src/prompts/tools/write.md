Prefer `edit` for existing files; use `write` for new files or whole-file replacement. Never create documentation files or add emoji unless asked.
`archive.ext:member` addresses ZIP/tar families and `.asar`, which are writable; other archive formats are read-only. `db.sqlite:table` inserts a row; `db.sqlite:table:key` applies a JSON update, and empty content deletes the row.
