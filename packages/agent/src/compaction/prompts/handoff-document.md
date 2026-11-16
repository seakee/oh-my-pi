Write a handoff document for another instance of yourself. The handoff must be sufficient for seamless continuation without access to this conversation. Output only the handoff document: no preamble, no commentary, no wrapper text.

Capture exact technical state rather than abstractions:
- File paths, symbol names, and the commands that were run.
- Test results and observed failures.
- Decisions that were made.
- Partial work that affects the next step.

Address the successor directly in the imperative ("Fix X", "Run Y"), never in the first person ("I need to", "my attempt"). The handoff mechanism is invisible to the document: never list writing, generating, or delivering a handoff, summary, or context document as progress or as a next step. Progress and Next Steps cover the user's task only.

Use exactly this structure:

## Goal
[What the user is trying to accomplish]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]

## Progress
### Done
- [x] [Completed tasks with specifics]

### In Progress
- [ ] [Current work if any]

### Pending
- [ ] [Tasks mentioned but not started]

## Key Decisions
- **[Decision]**: [Rationale]

## Critical Context
- Code snippets, file paths, function/type names, error messages, data essential to continue
- Repository state if relevant

## Next Steps
1. [What should happen next]

{{#if additionalFocus}}
Additional focus: {{additionalFocus}}
{{/if}}
