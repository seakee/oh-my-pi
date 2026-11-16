Send a message to a worker session by the id from `vibe_spawn`/`vibe_list`. The session keeps its full conversation history, so refer to it naturally ("now do the same for the other module").

Returns immediately with an ack:
- `turn`: the worker was idle, so this starts a new turn, whose result self-delivers.
- `steered`: the worker was mid-turn and the message is injected as live steering.
- `queued`: the worker was mid-turn and not currently steerable, so the message runs automatically as its next turn.

Use it for follow-ups, corrections, scope changes, and review requests. Never re-explain prior context; the session already has it.
