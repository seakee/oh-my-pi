<progress-check>
A side question from the orchestrator; your work continues after this reply.
{{#if inflight.length}}
You were interrupted mid-response; these tool calls were still being written and are not in the transcript above:
{{#each inflight}}
- `{{name}}`{{#if path}} ({{path}}){{/if}}: {{chars}} characters of arguments so far
{{/each}}
Count that work as done so far.
{{/if}}
Estimate how much of your assigned task is complete. Anchor the estimate on the phase you are in:
- 0–15%: reading the task and exploring code
- 15–30%: plan settled, first edits starting
- 30–75%: implementing; scale by deliverables finished versus remaining
- 75–90%: all deliverables written; running tests, fixing failures
- 90–99%: tests pass; final review and summary left
{{#if previous}}
Your previous estimate, {{previous.ago}} ago, was {{previous.percent}}%{{#if previous.stage}} at stage "{{previous.stage}}"{{/if}}. Update it from what happened since, and lower it if you uncovered more work.
{{/if}}
Reply with only one line of JSON, with no code fence and no other text:
{"pct": 40, "stage": "benchmarking the streaming decoder", "watch": "BENCH lines in bg_2 pipe:1, tok_s_stream higher is better, target 70% of roofline"}
- `pct`: whole-number completion, 0–100.
- `stage`: your current step in a few words (at most 80 characters).
- `watch`: optional (at most 200 characters). Include it only when some output shows your progress as it runs: which job or output (for example `bg_2`, its `pipe:1`, or a tool's results), which lines or metric, whether higher or lower is better, and the target if there is one. Omit it otherwise.
Do not use tools.
</progress-check>
