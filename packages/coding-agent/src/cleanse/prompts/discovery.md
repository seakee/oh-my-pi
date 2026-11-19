Do not edit project files; this is read-and-verify discovery only.
Run each proposed command once.
Finish with exactly one JSON object matching the schema below, with no prose and no code fences.

# Checker Discovery

The user asked the cleanse workflow to detect and repair: **{{request}}**

Identify the project commands that surface exactly these diagnostics, so the orchestrator can run them, parse the output, and dispatch repair agents.

# Workflow
1. Inspect manifests, configs, lockfiles, and scripts for the relevant tooling.
2. Determine the exact command and working directory. Prefer project-local binaries (`node_modules/.bin`, `.venv/bin`, wrappers such as `gradlew`) over global tools.
3. Prefer machine-readable output that matches a known parser below. Otherwise use gcc-style `file:line:col: severity: message` output with the parser `generic`.
4. Run the command once: verify that it executes and that its output matches the chosen parser. A non-zero exit with parseable diagnostics is fine; a crash or usage error is not.
5. If several commands cover the request, return one entry per command.

## Known parsers

|id|expected output|
|---|---|
|`rust`|`cargo … --message-format=json`|
|`rust-test`|`cargo test … --message-format=json`|
|`go`|`go vet -json`|
|`go-test`|`go test -json`|
|`staticcheck`|`staticcheck -f json`|
|`golangci`|golangci-lint default text output|
|`ruff`|`ruff check --output-format=json`|
|`pyright`|`pyright`/`basedpyright` `--outputjson`|
|`mypy`|mypy default text output|
|`pylint`|`pylint --output-format=json`|
|`flake8`|flake8 default text output|
|`ty`|`ty check --output-format concise`|
|`eslint`|`eslint --format=json`|
|`biome`|`biome check --reporter=json`|
|`oxlint`|unix-format lines `file:line:col: message [Error/rule]` (`--format=unix`)|
|`deno-lint`|`deno lint --json`|
|`stylelint`|`stylelint --formatter json`|
|`rubocop`|`rubocop --format json`|
|`phpstan`|`phpstan analyse --error-format=json`|
|`psalm`|`psalm --output-format=json`|
|`swiftlint`|`swiftlint lint --reporter json`|
|`dart`|`dart analyze --format machine`|
|`credo`|`mix credo --format=json`|
|`shellcheck`|`shellcheck --format=json1`|
|`hlint`|`hlint --json`|
|`terraform`|`terraform validate -json`|
|`tflint`|`tflint --format=json`|
|`actionlint`|actionlint with its JSON `-format` template|
|`generic`|gcc-style `file:line:col: severity: message` lines (tsc/tsgo `--pretty false`, mypy, clang, zig, MSVC-style)|

## Output schema

```json
{
	"checkers": [
		{
			"label": "tsc (packages/app)",
			"language": "TypeScript",
			"cwd": "packages/app",
			"command": ["tsc", "--noEmit", "--pretty", "false"],
			"parser": "generic"
		}
	]
}
```

- `command`: an argv array whose first element is the binary name or a project-relative path. Never shell-wrap it.
- `cwd`: the project-relative working directory; omit it for the project root.
- `parser`: a known parser id; omit it for `generic`.
- Return `"checkers": []` only if nothing in this project produces the requested diagnostics.
