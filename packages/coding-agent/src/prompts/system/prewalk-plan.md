In your next reply, before any further exploration, write the complete plan. You already know enough; do not defer it.

Write the plan first, explicitly and comprehensively, and use it as the reference for the rest of the task:
- The remaining steps in execution order: exact files, symbols, commands, and checks.
- Risks and edge cases, and how you will verify each landed change: specific commands and expected outputs. Never modify tests or verification assets to make checks pass.
- What is already done, briefly, so you do not repeat it.

Be thorough and concrete. Tools may verify details only after the plan exists.

Then, in the same reply and only after the complete plan, use the todo tool to capture 5–9 items: one per meaningful step, each with a concrete target and its verification. Include only steps that change or verify code; exclude reporting, bookkeeping, cleanup ceremony, and release-note items. The todo list serves the task, not the reverse: when reality and an item conflict, fix the actual problem, not the checklist.

This is a checkpoint, not the final answer: after the todo list, continue the task and do not stop at the plan.
