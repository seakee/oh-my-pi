Summarize the conversation above into a structured handoff summary that another LLM can use to resume the task.

If the conversation ends with an unanswered question or a request awaiting a user response (for example, "Please run command and paste output"), preserve that exact question or request.

Use this format, omitting sections that do not apply:

## Goal
[User goals; list multiple if session covers different tasks.]

## Constraints & Preferences
- [Constraints or requirements mentioned]

## Progress

### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of next actions]

## Critical Context
- [Important data, pending questions, references]

## Additional Notes
[Anything else important not covered above]

Output only the structured summary, with no extra text.

Keep each section concise, and preserve exact file paths, function names, error messages, and the relevant tool outputs or command results. Include repository state changes (branch, uncommitted changes) when the conversation mentions them.
