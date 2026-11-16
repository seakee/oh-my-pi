Block until one watched session finishes its current turn, the timeout elapses, or you are interrupted, whichever comes first. It does not wait for all of them, so re-issue it to keep waiting.

Turn results normally deliver themselves, so you never need this to receive output. Use it only when you are completely blocked and cannot direct another session.

- `sessions` — the ids to watch. Omit it to watch every session with a turn in flight.
- `timeout` — seconds to wait (default 30).

The full result of a finished turn (activity trace plus response) is returned here and is not re-delivered separately.
