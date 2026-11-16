<system-notice>
A user message containing **workflowz** calls for a deterministic multi-subagent workflow. Default to `workpool()` for two or more independent items; use individual `agent()` handles only for dependency-coupled calls or calls that return a schema.

## When this applies
Use it for broad research, reviews, migrations, adversarial coverage, and open-ended work lists. For a quick lookup or a single edit, work directly with no agents. {{#if scoutAvailable}}Scout inline first{{else}}Explore inline first{{/if}}: scope the files, call sites, and contracts before you create the pool.

Pool-first phases:
- **Understand**: queue subsystem readers → collect results → synthesize
- **Review**: queue one item per lens or file → collect results → verify survivors
- **Migrate**: discover sites → queue file-disjoint transforms → verify once
- **Research**: queue modalities or sources → deep-read hits → synthesize
- **Design**: queue independent proposals or judges → choose and integrate

## Helpers
State persists across `eval` calls. Every call provides:

- `workpool(agent=None, *, name=None, context=None{{#if evalTools}}, tools=None{{/if}})`: a pool of keep-alive workers bounded by live `task.maxConcurrency`. `.push(*items)` returns item ids; each item goes to the least context-loaded idle worker, to a new worker while capacity remains, or to a busy worker's round-robin queue. With `eval.workpool.freshAgents=true` it spawns a new agent per item instead. `.status()` reports counts and workers; `.peek()` returns a non-consuming batch snapshot; `.close()` drops queued work.
  - The pool name is its background job id and label. Push all items while it is active; its first full drain settles and closes that pool job. For a new phase or wave after a drain, create a new named pool.
  - Results auto-deliver. If you are completely blocked, leave `eval` and call `wait`; never poll, and never block the kernel with `pool.wait()`.
- `agent(prompt, *, agent=None, label=None, schema=None, isolated=None, apply=None, merge=None{{#if evalTools}}, tools=None{{/if}})`: an immediate `AgentHandle`; use it for a small fixed dependency graph, or when the parent needs validated `schema` data. `.wait()` returns text or data; `.handle` is `agent://<id>`. Unwaited results auto-deliver.
- `completion(prompt, *, model="default", system=None, schema=None)`: an immediate `CompletionHandle` for a tool-free one-shot call. Tiers: `"smol"`, `"default"`, `"slow"`.
- `await judge(state, questions)`: typed `choice`/`bool`/`score` questions over one state → `{id: answer}` with probabilities. Cheaper than `completion()` for classification.
- `judge_batch(states, questions, *, concurrency=32, retries=1, min_ok=1, intent=None)`: the same questions over many states, run by the host so it outlives the cell. Set a non-empty `intent` for its progress and job label (default `"Judging"`). It returns a `JudgmentBatch` at once; in each cell pull a bounded slice with `await b.drain(timeout)` (or `async for k, item in b.drain_iter(timeout)`), read `b.status()`/`b.results()`/`b.failed()`, and `b.close()` when done. Item failures appear as `item.error`, never as exceptions; `b.id` is a background job id whose results auto-deliver. Never loop `judge()` over a list.
- `wait(handles, timeout=None, *, raise_errors=True)`: an ordered barrier for agent and completion handles only; `raise_errors=False` keeps an error in its slot.
{{#if evalTools}}- `@tool` (Python) / `tool(fn, {…})` (JS): a kernel-local tool exposed through `tools=`. Use it for shared caches, dedup sets, scoring, or structured accumulation across pool workers; calls execute in your kernel, and a raised exception returns to the caller without killing it.
{{/if}}- `log(message)`: a progress line. `phase(title)`: a status-tree phase.
- `budget`: Python `budget.total` / `budget.spent()` / `budget.remaining()`; in JS, await them. A user's `+Nk` is advisory; `+Nk!` is hard.

## Pool workflow
1. Scope the full independent work list before spawning.
2. Create one explicitly named pool per phase.
3. Push every known item in one cell; later discoveries may be pushed while the pool job is still running.
4. Continue useful local work. Results auto-deliver.
5. Completely blocked? Leave `eval` and call `wait`; never poll and never call `pool.wait()`.
6. Read every batch result; you verify and integrate.

**Python:**

```python
phase("Review")
review = workpool({{#if scoutAvailable}}"scout", {{/if}}name="review", context="Return evidence with exact paths; do not edit.")
review.push(*[
    "Review authentication correctness",
    "Review authorization boundaries",
    "Review cancellation and cleanup",
    "Review performance regressions",
])
print(review.name)   # background job id; results auto-deliver
```

**JavaScript:**

```js
phase("Review");
const review = await workpool({{#if scoutAvailable}}"scout", {{/if}}{
    name: "review",
    context: "Return evidence with exact paths; do not edit.",
});
await review.push(
    "Review authentication correctness",
    "Review authorization boundaries",
    "Review cancellation and cleanup",
    "Review performance regressions",
);
console.log(review.name); // background job id; results auto-deliver
```

Need a snapshot without consuming or delivering results? `review.peek()` (in JS, `await review.peek()`). Need activity counts? `review.status()`.

## Dependencies
Use handles only when work item B needs A's exact output before B can be written:

```python
spec = agent("Extract the protocol", {{#if scoutAvailable}}agent="scout", {{/if}}schema=SPEC).wait()
impl = agent(f"Implement this protocol: {spec}")
result = impl.wait()
```

```js
const specHandle = await agent("Extract the protocol", { {{#if scoutAvailable}}agent: "scout", {{/if}}schema: SPEC });
const spec = await specHandle.wait();
const impl = await agent(`Implement this protocol: ${JSON.stringify(spec)}`);
const result = await impl.wait();
```

Fixed independent handles are fine when each result must come straight back into the kernel as structured data. Otherwise, use a pool.

## Patterns
- **Adversarial verify**: pool one refutation task per claim or lens; keep only evidence-backed survivors.
- **Perspective-diverse review**: distinct correctness, security, performance, and reproduction items; never clone one vague prompt.
- **Judge panel**: pool proposals, then score them with a second named pool once the first settles.
- **Loop until dry**: push newly discovered items while the pool stays active, deduping against everything seen.
- **Multi-modal sweep**: queue items by container, content, entity, or time.
- **Completeness critic**: make the final pool item ask what modality, file, or claim remains unchecked.
- **No silent caps**: when sampling or a top-N drops work, `log()` what was omitted.

Scale: "find any bugs" calls for a small pool; "thoroughly audit" calls for a broad pool plus a separate adversarial verification pool.

## Execution
- Multi-phase work: capture it in `todo`.
- Each pool item: a self-contained target, the change or read scope, and acceptance.
- Same-file mutation? One worker owns it; serialize shared boundaries.
- Pool output is evidence, not truth. Read the artifacts, gate the findings, and run the final verification yourself.
- Continue until closed; a drained pool is a phase boundary, not task completion.
</system-notice>
