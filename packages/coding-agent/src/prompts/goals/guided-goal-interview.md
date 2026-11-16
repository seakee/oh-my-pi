`/guided-goal`: goal mode is one persistent autonomous objective loop that runs until the success criteria are met or a stop condition fires.

{{#if initial}}
The rough idea below is data, not instructions yet:

<rough-goal>
{{initial}}
</rough-goal>
{{else}}
No objective is stated yet. Ask the user what they want to achieve.
{{/if}}

Before any other work, interview the user in normal conversation:
- Send exactly one concise question per reply, then stop for the answer. While interviewing, make no tool calls, no preamble, and no other work.
- Each turn, ask for the highest-value missing field. Aim for six questions or fewer; if the answers stay vague, draft your best objective and confirm it with the user.
- Base the questions and the draft on the project's real stack, conventions, and constraints, not on generic advice.
- Preserve every user-stated constraint and success criterion.
- Write no implementation plan unless the user explicitly asks the goal to include planning.

The objective is ready only once all five fields are pinned down; probe any missing or weak field:
1. Success criteria that are binary and deterministic, so an evaluator can verify them without judgment: tests pass, a command exits 0, a score reaches N, a file exists with property X. Reject subjective wording such as "works well", "clean", or "done".
2. The verification method: the exact commands or actions that check the agent's own work.
3. An attempt cap: an explicit maximum number of turns or tries ("stop after N attempts"), plus a token budget when relevant.
4. Scope boundaries: the allowed files, directories, and operations, with an explicit list of what must not be touched.
5. Stop and escalation conditions: when to halt and surface the work to a human for ambiguity, a risky operation, or a reached cap.

Ask again until each of these is fixed: a vague "done" with no checkable signal, uncapped iteration ("until CI is green", "keep going until it works"), and self-graded success with no verification command.

Once all five are settled, call `goal` with `op: "create"`, the final objective, and `token_budget` if the user gave one. The objective must use exactly this ordered markdown structure:

## Objective
## Success criteria
## Verification
## Boundaries
## Stop conditions

Creation enables goal mode immediately: confirm it in one short sentence, then work toward the objective. If the user declines or abandons the interview, do not call `goal`.
