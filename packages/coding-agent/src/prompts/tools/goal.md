Manage the active goal-mode objective.

A single `op` field selects the operation:
- `create`: starts a goal and enables goal mode. Requires `objective`, and accepts an optional positive `token_budget`. Only valid when no goal exists and none is paused.
- `get`: returns the current active or paused goal and its remaining token budget.
- `pause`: stops continuation while blocked on the user.
- `resume`: re-activates a paused goal for continued work.
- `complete`: marks the goal complete only when it is actually done and every deliverable is verified against current evidence—never simply because the budget is low or the turn is ending.
- `drop`: discards the current goal without completing it and ends goal mode. The `manage_goal` tool then leaves your tool set immediately, so you cannot `create` a replacement, not even later in the same turn or code cell. To change the objective, do not drop it; ask the user to set the new goal.

When `get` reports a paused goal, call `resume` before continuing work.
