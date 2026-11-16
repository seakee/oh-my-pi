<omfg>
The user is frustrated about recurring agent behavior.
Author one Time Traveling Stream Rule (TTSR) that would have caught the offending behavior earlier in this conversation.

How a TTSR works:
- A rule is a markdown file with YAML frontmatter. Its body is injected as correction guidance when the rule triggers.
- `scope` is a comma-separated allowlist of checked outputs:
  - `text` = assistant prose. `thinking` = reasoning summaries. `tool` = every tool call.
  - `tool:<name>(<glob>)` = one tool, and only when its file path matches the glob, for example `tool:write(*.rb)` or `tool:edit(*.ts)`.
- Edit and write calls are checked as the source text they write; other tool calls are checked as JSON-serialized arguments.
- Three trigger kinds:
  - `condition`: JavaScript regex patterns, matched while output streams. A hit interrupts the stream.
  - `astCondition`: ast-grep patterns (`$X` = one node, `$$$ARGS` = many), matched against edit/write source; the language comes from the file extension, so the scope must be `tool:edit(<glob>)` or `tool:write(<glob>)` with an extension.
  - `question`: a natural-language yes/no question that a small classifier answers after the output completes. It never interrupts: the offending output already took effect and the body arrives later as a warning. It costs one classifier call per in-scope output.

Choosing a trigger:
- Prefer `condition` or `astCondition`. They are exact, free, and interrupt before damage.
- Code structure (call shapes, nesting, argument patterns) calls for `astCondition`; literal tokens or phrases call for `condition`.
- Use `question` only when no pattern can catch the behavior without false positives: semantic claims, tone, reasoning quality, intent (for example "claims tests pass without running them").
- A `question` must be answerable from the output alone, and yes must mean the rule is violated.
- With `question`, add a `condition` prefilter when the offending output always contains some literal cue, so the question is asked only when the cue appears.

Output contract:
- Emit exactly one JSON object and nothing else.
- JSON fields: `name`, `description`, `scope`, `body`, and at least one of `condition`, `astCondition`, `question`.
- `name` uses kebab-case.
- `description` is a one-line summary.
- `condition` and `astCondition` are a string or an array of strings. `question` is one string.
- The triggers must catch the specific offending assistant output visible earlier in this conversation.
- Escape regex backslashes for JSON exactly once: write `"\\beval\\s*\\("`, never `"\\\\beval\\\\s*\\\\("`.
- Keep triggers precise; never use broad catch-alls.
- `scope` is a string or an array of strings, as narrow as the complaint allows. Do not use `tool, text` unless the same bad behavior occurred in both tool calls and prose.
- For code complaints, prefer file-specific tool scopes: Ruby written through `write` → `tool:write(*.rb)`, not bare `tool` or `text`.
- `body` is markdown guidance that explains the right behavior concisely.
- The caller assembles the YAML frontmatter. Never emit markdown frontmatter or a fenced code block around the JSON.

Example shapes:
{
  "name": "ts-no-any",
  "description": "Never use `any` in TypeScript — use `unknown`, a generic, or the real type",
  "condition": ": any|as any",
  "scope": ["tool:edit(*.ts)", "tool:edit(*.tsx)", "tool:write(*.ts)", "tool:write(*.tsx)"],
  "body": "Never use `: any` or `as any`. Use `unknown`, a domain type, a generic, or a type guard."
}
{
  "name": "go-range-int",
  "description": "Use `for i := range n` instead of C-style counting loops",
  "astCondition": "for $I := 0; $I < $N; $I++ { $$$BODY }",
  "scope": ["tool:edit(*.go)", "tool:write(*.go)"],
  "body": "Write `for i := range n { … }` (Go 1.22+) instead of `for i := 0; i < n; i++`."
}
{
  "name": "no-unverified-test-claims",
  "description": "Never claim tests pass without having run them",
  "condition": "(?i)tests? (pass|are passing|succeed)",
  "question": "Does the reply claim tests pass without showing they were actually run in this conversation?",
  "scope": "text",
  "body": "Only report test results you observed. Run the tests, or say they were not run."
}

Complaint:
{{complaint}}

{{#if feedback}}
Failed attempts or requested amendments so far:
{{feedback}}

Latest candidate JSON:
{{previousRule}}

Regenerate one corrected rule. Fix the listed validation failures or the user's amendment, and never repeat failed scopes or triggers.
{{/if}}
</omfg>
