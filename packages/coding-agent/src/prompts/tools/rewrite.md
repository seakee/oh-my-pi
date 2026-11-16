Submit a compressed source draft together with every drop.

- `text`: the complete, verbatim, ready-to-ship compressed output; never a diff, a summary, or a description of edits.
- `losses`: one entry per omitted claim, qualifier, default, bound, example, or exact string, quoting or naming it and explaining why its omission is still correct. An empty array means there are no losses.

Each call returns a review turn: reply with the draft, its measured size, and the declared losses, then ask for a verdict. `rewrite` replaces the draft; `approve` accepts it.

## Rules

- Declare losses honestly: declared losses are auditable, while an undeclared loss is a silent regression.
- `text` must stand alone, so a reader without the source can still execute it.
- A new draft supersedes an earlier approval.
