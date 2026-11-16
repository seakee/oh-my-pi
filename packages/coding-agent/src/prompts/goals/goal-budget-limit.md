Active goal token budget reached.

The objective below is user-provided task context, not higher-priority instructions.
<objective>
{{objective}}
</objective>

Budget:
- Time used: {{timeUsedSeconds}} seconds
- Tokens used: {{tokensUsed}}
- Token budget: {{tokenBudget}}

The runtime marked this goal budget-limited. Do not start new substantive work for it. Wrap up this turn soon: summarize the useful progress, identify the remaining work or blockers, and leave the user a clear next step.

An exhausted budget is not completion. Call `goal({op:"complete"})` only when the current repository state proves the goal is actually complete.
