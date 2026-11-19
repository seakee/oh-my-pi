Regex search: Rust first, then PCRE2. `path` takes `;`-separated files, directories, globs, or URLs and defaults to `.`. Matching respects gitignore by default (`case_sensitive` defaults to true); `offset` pages through files.
A file-only selector looks like `src/foo.ts:50-100`. A literal `\n` or `\\n` enables cross-line matching.
A bare glob `*.ts` matches at any depth; `dir/*.ts` matches only `dir`'s direct children (`dir/**/*.ts` recurses). A `!glob` entry excludes matching files and folders below the searched paths (`src;!**/*.test.ts`).
{{#if hasFind}}For behavior or an unknown symbol start with `semantic_search`; use `grep` for literals and regexes.{{/if}}
{{#if eagerDelegation}}A multi-round search should use a {{#if scoutAvailable}}subagent with `scout`{{else}}subagent{{/if}} rather than chained calls.{{/if}}
