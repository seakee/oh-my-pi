Update the existing handoff summary inside the <previous-summary> tags with the new messages above, so another LLM can resume the task.

Requirements:
- Preserve all information from the previous summary, and add new progress, decisions, and context.
- Move completed "In Progress" items to "Done".
- Update "Next Steps" for work that is now complete.
- Preserve exact file paths, function names, and error messages.
- Remove content that is no longer relevant.
- If the new messages end with an unanswered user question or request, add it to Critical Context and replace any previous pending question it answers.
- Output only the structured summary, with no extra text.
- Keep the sections concise.
- Preserve relevant tool outputs and command results.
- Include repository state changes (branch, uncommitted changes) when they are mentioned.

Format (omit sections that do not apply):

## Goal
[Preserve existing goals; add new ones if task expanded]

## Constraints & Preferences
- [Preserve existing; add new ones discovered]

## Progress

### Done
- [x] [Include previously done and newly completed items]

### In Progress
- [ ] [Current work—update based on progress]

### Blocked
- [Current blockers—remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context; add new if needed]

## Additional Notes
[Other important info not fitting above]
