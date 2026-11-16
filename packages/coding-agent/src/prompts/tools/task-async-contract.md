Results auto-deliver; never poll.{{#if waitTool}} Completely blocked? Call `wait` to receive the first settled job you started.{{/if}}
{{#if ircEnabled}}Coordinate while peers run through `write agent://<id>`, or `agent://all` to broadcast.{{/if}}

`read proc://` lists jobs and services; `read proc://<id>` inspects status or output without consuming delivery. `write proc://<id>/kill` cancels or stops one, with no `content`.

Job IDs are process-local. Delivered results expire shortly (about 30s); unconsumed results last about 5min. Agent output and transcripts stay readable at `agent://<id>` / `history://<id>`.{{#if ircEnabled}} `write agent://<id>` messages a live agent.{{/if}}

`completed` means the subagent yielded successfully; the artifacts it claims are unverified.
