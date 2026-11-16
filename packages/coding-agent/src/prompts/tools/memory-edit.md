Edit long-term memories by id, using only ids that `{{toolRefs.recall}}` returned.

Operations:
- `update`: rewrite working memory, replacing its content, its importance, or both.
- `forget`: permanently delete working memory.
- `invalidate`: softly supersede working or episodic memory, with an optional `replacement_id`.

Fact ids, marked `[facts]` in `{{toolRefs.recall}}` results, are read-only. Inspect them with `read memory://<id>`; any edit op returns `not_editable`.

Prefer `invalidate` for stale memory whose history may still be useful, and reserve `forget` for content that has to be hard deleted.

Read the full memory before an `update`. Recall previews are clipped, with a trailing `…` marking truncation and `full_length` giving the original size, and `update` replaces content wholesale, so updating from a preview deletes its unseen tail. Read `memory://<id>` first, then pass the merged content in `content`.
