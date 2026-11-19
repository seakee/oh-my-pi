A wrapper over `gh` operations: repos and files, pull requests, search, checkout, push, and Actions watching. To read an issue or PR, use `issue://<N>` or `pr://<N>`. For PR diffs, use `pr://<N>/diff` (files), `pr://<N>/diff/<i>` (a file slice, 1-indexed), or `pr://<N>/diff/all` (full). `?at=<generation>` pins that cached snapshot.

## Usage

Select the operation with `op`.
- `repo`: `[host/]owner/repo`; qualify the host for a repo outside the checkout's own GitHub instance.
- `repo_view`: omit `repo` for the current checkout.
- `file_read`: read `path` from `repo`; omit `repo` for the current checkout and `branch` for the default branch.
- `pr_create`: `head` defaults to the current branch.
- `pr_checkout`: checks PRs out into dedicated git worktrees, never the working tree; an array `pr` batches several in one call.
- `pr_push`: requires a prior `op: pr_checkout`.
- `search_issues`/`search_prs`/`search_commits`/`search_repos`: `query` is optional alongside `since`/`until`, so omit it for a date-only filter. `search_code` requires `query` and rejects `since`/`until`.
- `search_*`: `repo` defaults to the current checkout's `owner/repo`; search elsewhere with `repo:`/`org:`/`user:` in `query`. `search_repos` ignores `repo` and takes its scope from `org:`/`language:` in `query`.
- The boolean operators `AND`/`OR`/`NOT` combine text terms, not qualifiers, so do not place them between qualifiers.
- `since`/`until`: a relative `<n>` with `m`/`h`/`d`/`w`/`mo`/`y` (for example `3d`, `2w`), an ISO date `YYYY-MM-DD`, or an ISO datetime. `dateField: "updated"` uses update time for issues and PRs and push time for repos, never creation time.
- `run_watch`: omit `run` to watch every run for the current HEAD; `branch` defaults to the current one. It fast-fails on the first job failure.

## Output

A concise summary per operation. `run_watch` failures save full logs to a session artifact.

## Rules

For a file in a GitHub-hosted repository, use `file_read` rather than `curl` or `wget`.
