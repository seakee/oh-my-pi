# Provider-neutral prompt fork

## Baseline and delivery

- Fork: <https://github.com/seakee/oh-my-pi>.
- Upstream: <https://github.com/can1357/oh-my-pi>.
- Baseline: `v19.0.0`, commit `57771ae562b9345e0579bceb2d68d585e3e6927e`.
- Development branch: `refactor/provider-neutral-prompts-v19.0.0`.
- The locally verified candidate is Darwin x64, built with Bun 1.4.4. Other platforms require their own native addon and build; cross-platform acceptance is not claimed.
- The upstream package version remains unchanged for native-addon compatibility; `--version` alone does not identify this fork. Record the Git commit and binary SHA-256 for a build.
- This is a source-only fork. These changes do not publish a separate npm package or a prebuilt GitHub Release.

## Install this fork from source

Use Git, Bun 1.4.4 (the verified build runtime), and the Rust/platform C/C++ toolchain required by the [native build guide](./natives-build-release-debugging.md#local-development). Native compilation may download a toolchain and substantial dependencies. The commands below use the existing upstream host-build path; the local acceptance build reused a matching `v19.0.0` cached native addon rather than rebuilding Rust.

```sh
git clone --branch refactor/provider-neutral-prompts-v19.0.0 --single-branch https://github.com/seakee/oh-my-pi.git oh-my-pi-neutral
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

The upstream `omp.sh`, Homebrew, and npm installation commands install upstream OMP, not this fork. Do not run the upstream self-updater on a fork build: update this checkout and rebuild instead. Return to the previous executable by invoking its original command; side-by-side installation does not require changing global configuration.

## Scope

This is a source-level rewrite of application-owned instructions paired with bidirectional Wire tool/schema translation (`wire-tool-codec` / `tool-wire-name`), not a runtime replacement dictionary, a client-identity spoof, or a transfer of system instructions into user messages.

Rewritten and updated surfaces include:

- Default, custom, personality, and project-context templates.
- Tool descriptions, deferred tool catalogs (`xd://`), and tool-selection guidance aligned to Wire tool names (`execute_code`, `delegate_task`, `await_jobs`, `task_list`, `prompt_user`, `semantic_search`, `syntax_rewrite`, `syntax_search`, `submit_output`, etc.).
- Default `inlineToolDescriptors` set to `"off"` so tool descriptors remain in provider `tools[]` schemas instead of duplicating into system `instructions` (avoiding upstream `editDescription` and inline schema rule triggers), plus sanitized `commit-guidance.md`.
- Task agents, planning, review, commit, live, compression, and other auxiliary instructions.
- Title generation, memory extraction/consolidation, compaction, handoff, and archive-summary instructions.
- Application-owned tool-call dialect explanations and auxiliary provider notes.

Runtime-generated deferred tool catalogs, incomplete-commit reminders, and checkpoint-rewind reminders render dedicated templates instead of assembling fixed prose in TypeScript.

The cutover preserves:

- Canonical internal tool implementations, schemas, arguments, internal URI schemes, and real file paths.
- Handlebars bindings and conditional branches.
- User/project rules, custom prompts, skills, and extension/server instructions.
- Machine-consumed markers, including `<!-- USER -->`, `<project-context>`, `<memories>`, `<summary>`, title markers, checkpoint warnings, and structured JSON fields.
- Provider-required identity and actual tool-call serialization formats.

Technical examples, benchmark fixtures, and required provider identity are not scrubbed merely because they contain a product or model name. Custom user/project content can still contain strings matched by a gateway rule; preserving those instructions is intentional.

## Verification

- **2026-11-15 (`v18.12.6` baseline)**: isolated acceptance checks covered Carbon/Hydrogen/Argon CLI tasks, RPC compaction (`node-17` / `amber-42`), online title generation, memory extraction/consolidation JSON contracts, startup skill-description helper, 16-package typecheck, and focused contract tests with zero CPA replacement-rule matches across captured `instructions`, `messages`, and `input` system/developer roles.
- **2026-11-19 (`v19.0.0` + Wire codec + HTTP 429 fix)**:
  - `bun check --no-script` passed (`No type errors in 5,090 files` in `coding-agent`).
  - Template compilation and system prompt fingerprint verification passed across 414 runtime `.md` templates (`0 errors`, `0 fingerprint hits`).
  - `packages/agent` Wire codec suite and coding-agent config/prompt/SDK contract suites passed after fixing `sdk-task-async-guidance.test.ts`, `sdk-workpool-yield-schema.test.ts`, and `settings-manager.test.ts`.
  - Installed Darwin x64 standalone binary passed `--version` (`omp/19.0.0`), `--smoke-test` (`smoke-test: ok`), and live `oracle-cpa/gemini-3.8-flash-high` (`--thinking high`) and `oracle-cpa/gemini-4-hydrogen-xhigh` (`--thinking xhigh`) CLI print-mode requests with MCP and `mnemopi` active (HTTP `200`, exit `0`, zero `429`).

No prompt can guarantee permanent immunity to future opaque upstream filtering, and these observations do not independently prove that the upstream targets OMP as a product.

## Rebuilding

Use this branch and the `v19.0.0` baseline above. The verified runtime is Bun 1.4.4. For constrained dependency restoration when a matching native addon is already available, the local build used:

```sh
bun install --filter @oh-my-pi/pi-coding-agent --frozen-lockfile --ignore-scripts --omit optional --network-concurrency 8
bun install --filter omp --frozen-lockfile --ignore-scripts
bun --cwd=packages/coding-agent scripts/build-binary.ts
```

Provide a matching native addon using the repository's [native build documentation](./natives-build-release-debugging.md). The verified local build used the `19.0.0` Darwin x64 baseline addon. A sparse checkout must include `types/assets/index.d.ts`, as well as the package, documentation, script, patch, and web build inputs; otherwise type-checking or embedded asset generation will fail.

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
