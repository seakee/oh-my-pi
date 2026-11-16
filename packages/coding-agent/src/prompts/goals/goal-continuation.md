<!-- Hidden continuation steer. role=user, suppressed from visible transcript. -->

Continue the active goal.

<objective>
{{objective}}
</objective>

Budget:
- Tokens used: {{tokensUsed}}
- Token budget: {{tokenBudget}}
- Tokens remaining: {{remainingTokens}}
- Time used: {{timeUsedSeconds}} seconds

This is an autonomous continuation; the objective persists across turns. Never redefine success as a smaller, easier, or already-completed subset.

Before calling `goal({op:"complete"})`, audit the current repository state:

1. Objective → concrete deliverables: the required files, behaviors, tests, gates, and artifacts. Record them in the todo list or your reasoning.
2. Each deliverable → authoritative evidence: file contents, command output, test pass status, PR or issue state.
3. Inspect the actual current state: read the files and run the commands or tests. Do not rely on earlier-session memory, because the repository may have changed.
4. Verification scope must match claim scope. A narrow check (one file passing its unit test) does not prove a broad claim (the feature works end to end).
5. Uncertainty means not achieved: indirect evidence, partial coverage, missing artifacts, or an uninspected "looks right" means keep working, gather stronger evidence, or do more work.
6. An exhausted budget is not completion. Never call complete merely because the tokens are nearly spent. With a tight budget and unfinished work, leave the goal active, stop the turn, and let the user or runtime decide the next steps.

Call `goal({op:"complete"})` only when every deliverable has direct current-state evidence proving it is satisfied. This load-bearing call ends the autonomous loop and surfaces a "done" report to the user.

If work remains, keep working. Do not narrate the continuation; execute it.
