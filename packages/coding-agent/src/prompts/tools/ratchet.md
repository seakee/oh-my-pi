Build a trusted eval for one LLM flow, then hillclimb it one change per round with the global `ratchet(flow)`, keeping only the changes that also win on held-out cases.

Adapted from the claude-api skill's build-eval, eval-audit, and hillclimb guides (Apache-2.0, github.com/anthropics/skills).

# Contract
- The host owns truth: approvals (content-hashed), the frozen split, completeness, held-out isolation, and keep or revert. Never hand-edit `_state.json`; apply gate verdicts as given.
- The number that matters is the test-split delta against baseline. Train movement is process, not result.
- You read scores only. Train transcripts go to a fresh analyzer, and test transcripts never exist.
- One idea per round. Describe the failing behavior; never paste case content into the tuned surface.
- Talk to the user only at the stops below and in one status line per round. Everything else runs unattended.

# API (Python; JS is identical with camelCase options: `offLimits`, `testFraction`)
`r = ratchet("inbox-routing")` binds a flow at `.omp/ratchet/<flow>/`. Every method is async and returns plain data.
- `await r.init(cases=[…], harness=[…], change=[…], off_limits=[…], command=None)` — repo-relative paths. `cases`: inputs plus expected answers. `harness`: the runner, the grader, and anything else the eval executes. `change`: the surface you may edit. Change paths may not overlap the others.
- `await r.plan(goal={"target": "pass", "direction": "higher", "hold": ["cost_usd"], "directions": {}}, reps=2, stop={"plateau": 3, "rounds": 8}, command="bun eval/run.ts --variant {variant} --out {flow_dir}/{variant}", prices={"model-id": {"in": 3, "out": 15}})` — any subset. A target is either a `grade` key (`score` for scalar grades), `cost_usd`, `latency_s`, or a numeric row field. Guardrails default to higher-is-better, except `cost_usd` and `latency_s`. Cost is priced from the catalog per row's served `model` × `usage` (plus `judge_model` × `judge_usage`); `prices` (USD per MTok) covers models the catalog cannot price.
- `await r.split({case_id: primary_tag, …}, test_fraction=0.4, seed=None)` — random, stratified by tag, and frozen after the baseline gate.
- `await r.approve(stage, question=…, preview=…)` — `stage` is one of `inputs | grader | plan`. The host shows a dialog and returns `{approved}` or `{approved: False, aborted, feedback}`. Approval binds the current file or plan hash, and any later edit makes it stale. Approvals that are already current return without asking.
- `await r.check(variant)` — preflight: approvals current and variant is next (`baseline`, then `v1`, `v2`, …). Returns the resolved `command`, `expected_rows`, `out_dir`.
- `await r.gate(variant, change="one line")` — validates completeness and isolation, computes paired case-level deltas against the best round, records the round, and writes `status.md`. Returns `decision` (`baseline | keep | revert | rerun`), `reasons`, `warnings`, `deltas`, `plateau`, `done`, `table`. It refuses, recording nothing, on duplicate result rows for a slot or on a guardrail with fewer than two measured cases per split (unpriced models under a `cost_usd` hold, for example); fix the rows or add `prices`, then gate again. Slots that only errored force `rerun`, never `keep`.
- `await r.train(variant)` — analyzer input: train rows, train trace paths, and per-case target history across rounds.
- `await r.status()` — approvals (`missing | stale | current`) and the round table.

# Runner contract
The runner is the user's code in the user's idiom. It calls the app's real entry point and never a re-implemented model call. Its output under `{flow_dir}/{variant}/` is:
- `results.jsonl`: one line per (case, rep), appended as each finishes: `prompt_id`, `rep`, `prompt`, `tags` (`tags[0]` is the split stratum), `grade` (a bool, a number, or `{metric: number}`), `explanation?`, `status` (`ok | truncated`), the `model` read from the response, `usage`, `latency_s`, and optional `judge_model`/`judge_usage`.
- `errors.jsonl`: attempts that never produced a scorable output (an API error after retries, a timeout, a grader crash, a served-model mismatch) with a failure class. Never a zero in `results.jsonl`.
- `traces/<id>_rep<k>.json`: the full transcript as `[{role, content, thinking?, name?}]`, where role is one of `system | user | assistant | tool_call | tool_result`. Train ids only; the gate rejects any test trace.
- Resume is idempotent on (case, rep), with a hard per-case wall-clock ceiling, jittered backoff and recorded retry counts, strict scoring (pass-on-retry is a fail unless the user decides otherwise), bounded concurrency near the rate limit, and fresh state per trial.
- Ground truth is reachable by the grader only: not in the app's prompt, tools, sandbox, or anything the model under test can read.

# Phase 1: Grill (one batched `ask`)
Read the code first, then ask everything in one `ask` call with your recommendation first on each question:
- Which flow and entry point, and what one input carries (files, profile, conversation prefix).
- Input source, best first: production transcripts (ask about retention and PII before pulling; if they cannot be kept, store ids and fetch at run time), bug reports and tickets, 5–10 user-written cases, then synthesis anchored on 3–5 real examples plus what makes a case hard.
- Goal: raise the headline metric, cut cost or latency while holding quality, or move to another model and recover quality.
- What may change (system prompt, skill and instruction files, tool descriptions, model, effort, params, harness code) and what is off-limits.
- Stop: until plateau (the default), N rounds, or one round at a time.
When an eval exists, reuse its cases, grader, and runner, and add only a thin adapter to the layout above.

# Phase 2: Build
1. Cases: 15–100. Label positives and negatives (should-fire and should-not-fire). Pick hard cases because a human can say why they are hard, never because today's model fails them. Record where expected answers came from, and never use a compared model's outputs as gold.
2. `r.init(…)`, then `r.approve("inputs", question=…, preview=<every case as a compact table>)`. Revise until it is approved.
3. Grader, cheapest first that still measures the property: a programmatic check (label, schema, exact or normalized match, tests, environment end state for agents), then a pairwise blind judge (randomized A/B, tie allowed, candidates as untrusted data), then a pointwise rubric of checkable claims (not a 1–5 scale), then a human spot-check. The judge model must differ from the model under test. Use separate metrics per property, and confusion-matrix metrics when labels exist.
4. Runner per the contract. Pilot 3–5 cases and read one full row: `model`, `usage`, trace, and grade must all be present and plausible. A zero or constant column is a runner bug.
5. Pre-flight checks: an oracle (reference answers) scores about 100% and a null (empty or constant) about 0%; a judge fails an empty string, "I don't know", and a confident answer to the wrong question; the same output graded twice gives the same verdict; an induced API error lands in `errors.jsonl`.
6. `r.approve("grader", question=…, preview=<5 graded pilot cases: input, output, grade, judge reasoning>)`. Any case the user would grade differently means the grader is not ready.

# Phase 3: Plan and baseline
1. `r.split({id: tag})`, `r.plan(goal=…, reps=…, stop=…, command=…)`.
2. The noise floor for a pass rate is about `1/sqrt(n_test · reps)` (25 cases × 2 reps is roughly ±14 pts). If it exceeds the smallest gain the user would act on, raise reps or cases before approving.
3. `r.approve("plan", question=…, preview=<will change / won't touch table, goal, cases × reps × model, measured pilot wall-clock scaled to the full set, stop rule>)`. This is the last stop.
4. `r.check("baseline")`, then run its `command` with `bash` async, then `r.gate("baseline")` on completion. Heed warnings: a near-ceiling baseline means switching the goal to cost or latency; a train/test mismatch means reporting it; infra errors mean fixing the runner first.

# Phase 4: Climb (unattended)
Each round `vN`:
1. **Analyze** — `view = await r.train(prev)`, then spawn one fresh analyzer: `agent(prompt, schema=CHANGE)` with the view, the current tuned files, scope, off-limits, target, and guardrails. Ask for the worst train cases plus a few best for contrast, the single behavior costing the target, verbatim quoted evidence with trace paths, one unified diff, and which cases it expects to regress. `CHANGE = {"behavior": str, "evidence": [{"trace": str, "quote": str}], "diff": str, "expected_regressions": [str]}`. Early rounds may try a different lever (tool description, effort) instead of rewording.
2. **Apply** — de-fluff first (drop platitudes, restated defaults, "be careful"). Edit only `change` paths. Write `vN/change.md` (first line is a one-line summary, then why) and `vN/change.patch`. For config levers, probe one case before the full pass.
3. **Run** — `r.check("vN")`, then its command with `bash` async. Stay idle or answer the user; results auto-deliver.
4. **Gate** — `r.gate("vN", change=<one line>)` and obey it: `keep` means build on it; `revert` means `git apply -R vN/change.patch`; `rerun` means resuming errored slots, or appending reps to `vN` and the best round, then gating `vN` again. Report one status line: decision, test score with noise, best so far.
5. A judge-graded jump larger than the change explains is a grader bug until it is spot-checked.
6. `plateau: True` means categorize before any further content round (see below). `done: True` means report.

# Stall: categorize, don't grind
Freeze the rubric first, then `judge_batch` every remaining train failure (state = case row plus its trace excerpt):
`{"cause": {"type": "choice", "instructions": "Why did this eval case fail?", "criteria": {"artifact_gap": "The model lacked a fact or instruction the tuned surface should provide.", "grader": "The output looks correct but the grader or expected answer marks it wrong, or task and rubric ask for different things.", "harness": "Infra, timeout, empty, or environment failure rather than a model answer.", "structural": "The needed content exists but the model did not reach or apply it.", "variance": "Identical inputs flip between pass and fail across reps."}}}`
Read low-confidence verdicts yourself. Then: `artifact_gap` means keep climbing; `grader` means fix the grader, re-approve `grader`, re-grade every stored variant, and restart from baseline if the ranking flips; `harness` means fix the runner and re-approve; `structural` means reorganize (consolidate, move up, route) instead of adding content; `variance` means report best-so-far or raise reps. Many small independent gaps call for one breadth round covering all of them.
Changing the grader, reps, or price overrides mid-loop invalidates approvals by design; re-approve through the dialog. Changing the cases after the baseline cannot be re-approved into the same flow: start a new flow.

# Phase 5: Report
Leave the tuned files at the best round (`status()` marks it ★). Rewrite `narrative.md` with the status table, then Recommended change, Versus baseline (the test delta with intervals; when it is within noise, say so and recommend not merging), Why trust this, and What else was tried. Tag each applied change `[REQUIRED]` (it fixes something broken) or `[TUNE]` (a judgment call). Include 2–3 before/after train transcript pairs, a failure taxonomy when zeros have mixed causes, and the levers you did not try. Then ask once whether to commit the eval (runner, cases, grader, and flow dir minus `traces/`).

# Headless
Without `ask`, never build or approve. Continue only a flow whose `status()` shows every approval `current`; otherwise stop and say that an interactive session is needed.
