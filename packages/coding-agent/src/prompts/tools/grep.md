Regex search: Rust first, then PCRE2. `path` takes `;`-separated files, directories, globs, or URLs and defaults to `.`. Matching is case-sensitive and respects gitignore by default; `skip` pages through files.
A file-only selector looks like `src/foo.ts:50-100`. A literal `\n` or `\\n` enables cross-line matching.
A bare glob `*.ts` matches at any depth; `dir/*.ts` matches only `dir`'s direct children (`dir/**/*.ts` recurses).
{{#if hasFind}}For behavior or an unknown symbol start with `find`; use `grep` for literals and regexes.{{/if}}
{{#if eagerDelegation}}A multi-round search must go to a {{#if scoutAvailable}}Task with `scout`{{else}}Task{{/if}} rather than a chain of calls.{{/if}}
