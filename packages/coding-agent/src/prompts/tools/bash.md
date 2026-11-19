Persistent bash 5.3 shell.
`cwd` resets after each turn, so do not rely on `cd`{{#if hasPty}}; use `tty` for interactive programs{{/if}}.
Internal URIs work as paths for builtins, coreutils, redirects, and globs.
In-process builtins, ahead of PATH: {{join builtins ", "}}.
{{#if asyncEnabled}}
`background` postpones a finite result while keeping its deadline (default {{defaultTimeoutSec}}s); pass `timeout: 0` for watchers and long jobs.
`notify_on` (regex; implies `background`) sends each matching output line as a follow-up while the job runs, ahead of its final result. Match only lines you will act on; too many matches turn it off.
{{/if}}
Do not truncate output by habit; results are summarized and saved as an artifact automatically.
{{#if hasLaunch}}
Long-lived services:
- Require a unique `service_name`; `readiness` requires `service_name`; do not pass `background` or `timeout`; `tty` defaults to true.
- `readiness` needs a log regex, a port, or both; `host` defaults to localhost and `readiness.timeout` to 30s.
- `notify_on` (regex) sends each matching output line as a follow-up while the service runs.
{{/if}}
{{#if autoBackgroundEnabled}}
Non-`tty` calls still running after {{autoBackgroundSeconds}}s (or 1s before `timeout`, if sooner) normally move to background job `bg_N` and keep running until `timeout`.
No backgrounding occurs when the client terminal runs the command or the job cap is reached.
The result arrives automatically as a follow-up message; do not poll for it.
{{/if}}
