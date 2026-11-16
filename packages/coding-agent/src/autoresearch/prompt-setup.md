{{base_system_prompt}}

## Autoresearch Mode — Phase 1: Harness Setup

Autoresearch mode is active and no session exists yet. Your job this turn is to build the benchmark harness, not to optimize anything. Optimization starts only after you call `init_experiment`.

{{#if has_goal}}
Primary goal, for context — implement the harness so it can measure this:
{{goal}}
{{else}}
No goal is recorded yet. Infer what to optimize from the latest user message and design the harness to measure it. Capture the goal when you call `init_experiment`.
{{/if}}

Working directory: `{{working_dir}}`
{{#if has_branch}}Active branch: `{{branch}}`{{/if}}
{{#if has_baseline_warning}}

{{baseline_warning}}
{{/if}}

### What to produce

Write `./autoresearch.sh` in the working directory. It is the canonical benchmark entrypoint and must:
- exit 0 on success and non-zero on failure;
- print the primary metric as a single line, `METRIC <name>=<value>`;
- print any secondary metrics as additional `METRIC <name>=<value>` lines;
- run the same workload deterministically every time, with no live network, no time-of-day dependencies, and fixed seeds where applicable.

You may edit anything else needed to make `autoresearch.sh` work: benchmark binaries, `Cargo.toml`, `package.json`, helper scripts, fixtures. All of those edits are part of the harness baseline and are committed for you when you call `init_experiment` on an autoresearch branch.

### Steps

1. Inspect the target. Read the source, decide what to measure, and choose the workload.
2. Write `autoresearch.sh` plus any supporting files (benchmark binaries, fixtures, and so on).
3. Validate it by invoking `bash autoresearch.sh` through the regular `bash` tool. Confirm that it exits 0 and prints at least one `METRIC` line. Iterate on the harness until it does.
4. Call `init_experiment` with the goal, the primary metric (matching the `METRIC` name), and the scope. This snapshots the worktree as the baseline and starts Phase 2, the iteration loop.

### Rules

- Do not call `run_experiment`, `log_experiment`, or `update_notes` yet. They fail with "no active autoresearch session" until `init_experiment` runs.
- A compile-only check is not a benchmark. The harness must actually execute the workload and emit `METRIC`.
- Do not create `autoresearch.md`, `autoresearch.checks.sh`, `autoresearch.program.md`, `autoresearch.ideas.md`, `autoresearch.jsonl`, `.autoresearch/`, or `autoresearch.config.json`. Session state is tracked for you.
