Keep going until CI on the current branch is green. Never stop after a single fix attempt.

## Watching CI
Prefer `github` with `op: run_watch` and no other arguments when it is available; otherwise use the `gh` CLI.
After each push, the workflow runs for the current HEAD are the source of truth.

## Procedure
1. Watch the workflow runs for the current HEAD commit.
2. On a failed run, inspect the failing job's output and logs.
3. Identify the root cause and make the minimal correct fix.
4. Run local verification when it reduces the chance of another failed push.
{{#if headTag}}5. Push the branch and tag `{{headTag}}` atomically: `git push --atomic "{{remote}}" "{{branch}}" "+refs/tags/{{headTag}}"`.{{else}}5. Push the branch.{{/if}}
6. Watch the workflow runs for the new HEAD commit.
7. Repeat until the workflow runs for the latest HEAD commit succeed.

## Cautions
Each push starts a fresh CI attempt; immediately re-watch the new HEAD.
When the watcher output is insufficient, inspect the underlying workflow or job context before changing code.

{{#if headTag}}
## Tag Push
Push the branch and tag together, so the tag never points at an un-pushed or non-green commit. `--atomic` makes the branch and tag updates succeed or fail as one ref transaction, and `+refs/tags/{{headTag}}` force-moves the tag to the new HEAD. Never push the branch first and retag later.
{{/if}}

## Completion
Complete only when the workflow runs for the latest HEAD commit succeed.
{{#if headTag}}The latest HEAD commit must carry the tag `{{headTag}}`, pushed atomically with the branch via `git push --atomic`.{{/if}}
