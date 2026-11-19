Wait only when blocked with nothing else to do.
Blocks on background jobs or services you started, or on the answer to a question you sent this run{{#if subagent}}, or on your parent's next message{{/if}}.
When nothing you started is running and no answer is owed, it returns at once—as does waiting on an agent that is idle with nothing to wake it, or that is waiting on you.
- Wait only on your own jobs or services, or rarely on the answer to a question that blocks you.
- Do not wait for another agent's progress or for messages nobody owes you.
- If an agent you are waiting on is waiting on you, answer it first.
- When a result arrives while other jobs are still running, act on it before waiting again.
{{#if endTurn}}
- When nothing remains except waiting on your own jobs, services, or an owed reply, end your turn instead: each result or message starts your next turn.
{{else}}
- If a wait returns with nothing new and nothing else remains, call `await_jobs` right away with no other tool call; it then blocks up to {{longest}}, or longer for a reply.
{{/if}}
Results and messages auto-deliver; do not poll while work remains.
