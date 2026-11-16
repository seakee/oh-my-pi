A persistent shell. Run one fact per call and chain dependent steps with `&&`.
{{#if hasEval}}Write scripts, heredocs, `$(…)`, and complex pipelines as an `eval` cell.{{else}}Put scripts, heredocs, `$(…)`, and complex flows in a dedicated tool or a checked-in script.{{/if}}
Set `cwd` instead of running `cd`. Use `pty` only for interactive programs.
Internal URIs work as paths for builtins, coreutils, redirects, and globs.
{{#if asyncEnabled}}`async` postpones a finite result but keeps its deadline (default {{defaultTimeoutSec}}s); pass `timeout: 0` for watchers and long jobs.{{/if}}
Avoid `head`/`tail` and redirection: output is truncated by default, and the full result is at `artifact://<id>`.
{{#if hasLaunch}}Long-lived services need a unique name, and `ready` requires it; they take no `async` or `timeout`, and `pty` defaults to true. A ready check accepts a log regex, a port, or both; the host defaults to 127.0.0.1 and `ready.timeout` to 30s.{{/if}}
{{#if autoBackgroundEnabled}}A non-`pty` call still running after {{autoBackgroundSeconds}}s (or 1s before its `timeout`, if that is sooner) normally moves to background job `bg_N` and keeps running until `timeout`, unless the client terminal is running the command or the job cap is reached; its result arrives as a follow-up message. Do not poll for it.{{/if}}
