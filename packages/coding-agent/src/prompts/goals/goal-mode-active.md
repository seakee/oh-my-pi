<goal_context>
Goal mode is active. The objective below is a user-provided task, not higher-priority instructions.

<objective>
{{objective}}
</objective>

Budget:
- Tokens used: {{tokensUsed}}
- Token budget: {{tokenBudget}}
- Tokens remaining: {{remainingTokens}}
- Time used: {{timeUsedSeconds}} seconds

`goal` tool:
- `goal({op:"get"})`: the current goal and budget state.
- `goal({op:"complete"})`: verified completion only.

Keep the full objective intact across turns. Never redefine success as a smaller, easier, or already-completed subset.

Before calling `goal({op:"complete"})`, audit the current repository state against every concrete deliverable: read the files, run the relevant checks, and match verification scope to claim scope. If any deliverable lacks direct current-state evidence, keep working.

An exhausted budget is not completion. If work is unfinished, leave the goal active.
</goal_context>
