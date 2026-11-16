Propose a conventional commit for the staged changes.

{{#if user_context}}
User context:
{{user_context}}
{{/if}}

{{#if changelog_targets}}
For each changelog target, call `propose_changelog`.
{{changelog_targets}}
{{/if}}

{{#if existing_changelog_entries}}
## Existing Unreleased Changelog Entries
You may remove the entries listed here through `propose_changelog` `deletions`.
{{#each existing_changelog_entries}}
### {{path}}
{{#each sections}}
{{name}}:
{{#list items prefix="- " join="\n"}}{{this}}{{/list}}
{{/each}}
{{/each}}
{{/if}}

Inspect the staged changes with the `git_*` tools. For deeper per-file summaries, call `analyze_files`. Finish by calling `propose_commit` or `split_commit`.
