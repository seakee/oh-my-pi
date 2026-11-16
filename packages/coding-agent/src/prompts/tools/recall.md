Search long-term memory and return the raw, relevance-ranked matching entries.

Use it proactively before questions about past conversations, user preferences, project decisions, or any topic where prior context improves accuracy. When in doubt, recall first.

`{{toolRefs.recall}}` returns specific facts or entries; `{{toolRefs.reflect}}` returns a synthesized answer across many memories.

Results are content previews. A trailing `…` marks truncation (`truncated: true`, with `full_length` giving the original size). Before any `{{toolRefs.memory_edit}} update`, fetch the full row with `read memory://<id>`.
