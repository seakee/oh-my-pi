Manage the active goal-mode objective.

A single `op` field selects the operation:
- `create`: starts a goal and enables goal mode. Requires `objective`, and takes an optional positive `token_budget`. Only when no goal exists and none is paused.
- `get`: returns the current active or paused goal and its remaining token budget.
- `resume`: re-activates a paused goal for continued work.
- `complete`: marks the goal complete only when it is actually done and every deliverable is verified against current evidence. Never because the budget is low or the turn is ending.
- `drop`: discards the current goal without completing it and ends goal mode. The `goal` tool then leaves your tool set immediately, so you cannot `create` a replacement, not even later in the same turn or eval cell. To change the objective, never drop it; ask the user to set the new goal.

When `get` reports a paused goal, resume it before continuing work.
