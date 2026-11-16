# Provider-neutral prompt fork

## Baseline and delivery

- Fork: <https://github.com/seakee/oh-my-pi>.
- Upstream: <https://github.com/can1357/oh-my-pi>.
- Baseline: `v18.12.6`, commit `45c35e40c46166dc726ccc52f5d27f40f2449f99`.
- Development branch: `refactor/provider-neutral-prompts`.
- The locally verified candidate is Darwin x64, built with Bun 1.4.4. Other platforms require their own native addon and build; cross-platform acceptance is not claimed.
- The upstream package version remains unchanged for native-addon compatibility; `--version` alone does not identify this fork. Record the Git commit and binary SHA-256 for a build.
- This is a source-only fork. These changes do not publish a separate npm package or a prebuilt GitHub Release.

## Install this fork from source

Use Git, Bun 1.4.4 (the verified build runtime), and the Rust/platform C/C++ toolchain required by the [native build guide](./natives-build-release-debugging.md#local-development). Native compilation may download a toolchain and substantial dependencies. The commands below use the existing upstream host-build path; the local acceptance build reused a matching cached native addon rather than rebuilding Rust.

```sh
git clone --branch refactor/provider-neutral-prompts --single-branch https://github.com/seakee/oh-my-pi.git oh-my-pi-neutral
cd oh-my-pi-neutral
bun install --frozen-lockfile
bun run build:native
bun --cwd=packages/coding-agent scripts/build-binary.ts
./packages/coding-agent/dist/omp --version
```

On macOS/Linux, an optional side-by-side command avoids replacing an existing `omp`:

```sh
mkdir -p "$HOME/.local/bin"
install -m 755 packages/coding-agent/dist/omp "$HOME/.local/bin/omp-neutral"
"$HOME/.local/bin/omp-neutral"
```

Choose an unused destination if `omp-neutral` already belongs to another installation. The executable uses the normal OMP configuration, model credentials, sessions, and memory backend unless a profile or environment override selects a different location. Existing OMP users should back up their data before trying a shared-data build; avoid concurrent writes to the same session. New users must configure their own provider credentials; none are included in this repository.

Start a fresh main session for acceptance. A retained tool runtime or inherited session context can still supply old prompt text even after changing executables; a successful standalone request does not validate that retained task path. Do not stop unrelated processes merely to clear them.

The upstream `omp.sh`, Homebrew, and npm installation commands install upstream OMP, not this branch. Do not run the upstream self-updater on a fork build: update this checkout and rebuild instead. Return to the previous executable by invoking its original command; side-by-side installation does not require changing global configuration.

## Scope

This is a source-level rewrite of application-owned instructions, not a runtime replacement dictionary, a client-identity spoof, or a transfer of system instructions into user messages.

Rewritten surfaces include:

- Default, custom, personality, and project-context templates.
- Tool descriptions, deferred tool catalogs, and tool-selection guidance.
- Task agents, planning, review, commit, live, compression, and other auxiliary instructions.
- Title generation, memory extraction/consolidation, compaction, handoff, and archive-summary instructions.
- Application-owned tool-call dialect explanations and auxiliary provider notes.

Runtime-generated deferred tool catalogs, incomplete-commit reminders, and checkpoint-rewind reminders now render dedicated templates instead of assembling fixed prose in TypeScript.

The cutover preserves:

- Tool names, schemas, arguments, internal URI schemes, and real file paths.
- Handlebars bindings and conditional branches.
- User/project rules, custom prompts, skills, and extension/server instructions.
- Machine-consumed markers, including `<!-- USER -->`, `<project-context>`, `<memories>`, `<summary>`, title markers, checkpoint warnings, and structured JSON fields.
- Provider-required identity and actual tool-call serialization formats.

Technical examples, benchmark fixtures, and required provider identity are not scrubbed merely because they contain a product or model name. Custom user/project content can still contain strings matched by a gateway rule; preserving those instructions is intentional.

## Verification on 2026-11-15

The isolated acceptance configuration disables retries and model fallback. Its observation proxy forwards request bodies unchanged and never records authorization headers. The production CPA replacement rules remain enabled; independence from those rules is established by checking the captured system/developer text for every current rule, not by claiming the gateway was reconfigured.

| Surface | Observed result |
| --- | --- |
| Carbon CLI | Read and corrected an arithmetic fixture, executed Bun assertions, used the explicitly selected read-only subagent, and reported its exact sentinel and the project-rule marker. |
| Hydrogen CLI | Read fixtures, executed arithmetic assertions, and returned the sentinel and project-rule marker. |
| Full captured prompt replay | Carbon and Hydrogen each returned HTTP 200/completed with `OK`, retaining the captured system instructions and tool definitions. |
| Argon CLI | Initially unavailable with HTTP 400 `model_not_found`; later recovered and passed full-prompt replay and installed-CLI reads, Bun assertions, and project-rule checks under the real model ID. |
| RPC compaction | Completed compaction and subsequently recovered `node-17` and `amber-42` without including their answers in the follow-up question. |
| Title generation | The real online title API and parser returned `Repair invoice deployment automation`. |
| Memory prompt/output contract | Real extraction followed by consolidation retained `/srv/invoices`, `invoices.service`, and `billing-infra` in schema-valid JSON. This is not an end-to-end claim about background database scheduling. |
| Skill-description helper | Real startup helper requests completed successfully. |
| Static types | All 16 workspace package type-check commands passed. |
| Existing contracts | The pre-publication focused run passed 991 tests across 60 files; the supplemental memory/MCP/dialect/archive run passed 231 tests across 14 files. These runs overlap and their counts should not be added. |

The full payload audit includes `instructions`, `messages`, and `input` system/developer roles. None matched these active CPA replacement rules, case-insensitively:

- `system-conventions`, `system_conventions`
- `system-directive`, `system_directive`
- `This conversation is powered by`
- `RFC 2119`
- `Read xd://<tool> for full docs + JSON schema before first use.`

Some early fixture-discovery runs were deliberately cancelled and produced proxy-side broken pipes after HTTP 200. They are not counted as completed workflows. The final acceptance evidence distinguishes HTTP status from completion.

The maintainer subsequently reported normal day-to-day use. A separately requested real Gemini task from a retained runtime returned 429 before any tool calls; its recorded system prompt still began with the old instruction template, not the rebuilt template. This is not a clean acceptance of the fresh fork task path. The stale-context mechanism and exact cause of that failure remain unresolved. No prompt can guarantee permanent immunity to future opaque upstream filtering, and these observations do not independently prove that the upstream targets OMP as a product.

## Rebuilding

Use this branch and the fixed baseline above. The verified runtime is Bun 1.4.4. For constrained dependency restoration when a matching native addon is already available, the local build used:

```sh
bun install --filter @oh-my-pi/pi-coding-agent --frozen-lockfile --ignore-scripts --omit optional --network-concurrency 8
bun install --filter omp --frozen-lockfile --ignore-scripts
bun --cwd=packages/coding-agent scripts/build-binary.ts
```

Provide a matching native addon using the repository's [native build documentation](./natives-build-release-debugging.md). The verified local build used the existing `18.12.6` Darwin x64 baseline addon. A sparse checkout must include `types/assets/index.d.ts`, as well as the package, documentation, script, patch, and web build inputs; otherwise type-checking or embedded asset generation will fail.

The output is `packages/coding-agent/dist/omp`. Keep an immutable candidate copy and its SHA-256 instead of pointing a delivered command at a mutable build directory. Do not include credentials, authentication databases, or captured private conversations in a source archive.

## Updating from upstream

1. Preserve the previous candidate binary, its manifest, and the fixed baseline SHA. Review the intended upstream tag before changing the baseline.
2. Create a new maintenance branch, then merge the chosen upstream tag. Do not reset or overwrite the current implementation branch.
3. Resolve prompt changes by behavior and protocol, not by restoring the old wording or applying a new keyword dictionary. Inventory newly introduced prompt files and inline runtime instructions, including auxiliary/provider paths.
4. Preserve template bindings, branches, wire examples, delimiters, structured output, custom prompt precedence, user/project rules, and provider-required identity. Remove obsolete code rather than leaving two competing prompt implementations.
5. Run the applicable existing contract tests and workspace type checks. Delete assertions that pin incidental prose; retain meaningful state, parsing, boundary, and precedence checks.
6. Build a fresh candidate and exercise real tool execution, a real subagent, title generation, compaction, and the enabled memory path. Use an isolated profile with retries/fallback disabled.
7. Capture final provider payloads without authorization headers, inspect every system/developer location, and test each intended model under its real ID. Treat unavailable models as blocked rather than substituting another model.
8. Publish or switch the default installation only with the owner's authorization and after the acceptance gate is satisfied. Keep the previous executable for rollback.

See [system prompt customization](./system-prompt-customization.md) for the unchanged override and assembly contracts.
