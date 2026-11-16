A context checkpoint belongs before exploratory work; a later `rewind` keeps only the concise report.

Use it for investigations with many intermediate tool calls (`read`/`grep`/`glob`/`lsp`/etc.) to minimize the context cost that follows.

Rules:

- A started checkpoint must be rewound before you finish the turn.
- Never start a checkpoint while another is active.
- Subagents: disabled by default. To enable, list `checkpoint` or `rewind` in the agent definition's `tools:` frontmatter; the sister tool is included automatically, and the `checkpoint.enabled` setting is required.

Typical flow:

1. `checkpoint(goal: …)`
2. Exploratory work
3. `rewind(report: …)` with concise findings

After `rewind`, the intermediate checkpoint messages leave the active context and the report replaces them.
