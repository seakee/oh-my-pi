A context checkpoint belongs before exploratory work; a later `restore_checkpoint` keeps only the concise report.

Use it for investigations with many intermediate tool calls (`read`/`grep`/`glob`/`lsp`/etc.) to minimize the context cost that follows.

Rules:

- A started checkpoint must be rewound before you finish the turn.
- Never start a checkpoint while another is active.
- Subagents: disabled by default. To enable, list `save_checkpoint` or `restore_checkpoint` in the agent definition's `tools:` frontmatter; the sister tool is included automatically when checkpoints are enabled.

Typical flow:

1. `save_checkpoint(goal: …)`
2. Exploratory work
3. `restore_checkpoint(report: …)` with concise findings

After `restore_checkpoint`, the intermediate checkpoint messages leave the active context and the report replaces them.
