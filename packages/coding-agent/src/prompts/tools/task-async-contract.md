Results auto-deliver; do not poll.{{#if waitTool}} When completely blocked, call `await_jobs` until it returns the first settled job you started.{{/if}}
`completed` means the subagent finished cleanly; claimed artifacts remain unverified.
