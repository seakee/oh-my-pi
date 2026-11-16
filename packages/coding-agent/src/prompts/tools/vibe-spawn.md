Start a persistent conversational coding-agent worker session with editing, bash, grep, and the rest.

CLI flavor by task:
- `fast`: a low-latency model for mechanical, well-specified work (renames, boilerplate, running tests, data collection).
- `good`: a strong model for hard work (design, debugging, multi-file changes, judgment calls).

`prompt`: the first instruction for the session. The worker starts with no context beyond it, so include the files, constraints, and acceptance criteria.
`name`: an optional session label, generated when omitted.

Returns a session id immediately. When the worker finishes, its turn result (an activity trace plus the worker's response) is delivered automatically. Do not wait unless you are blocked; direct other sessions meanwhile.

The session persists after the turn and remembers the whole conversation. For a follow-up in the same workstream use `vibe_send`; never spawn a second session.
