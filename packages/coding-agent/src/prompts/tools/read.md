Use `read` for static web content; use the browser only when a page requires script execution.

Put line ranges in `path` rather than separate range, offset, or limit parameters:
- `{"path":"notes.txt:450-455"}` reads lines 450–455; `{"path":"notes.txt:-5"}` reads the last 5 lines.
- Include the selector on every ranged call; repeating a bare path does not advance through the file.

Path suffixes:
- `:50` reads line 50; `:50-` reads from line 50 onward; `:50-200` is inclusive; `:50+150` counts 150 lines from 50; `:-60` reads the last 60 lines.
- Commas join ranges (`:5-16,960-973`) or individual lines (`:19,59`).
- A single non-raw range also shows 1 line before and 3 after (`:50-80` shows 49–83).
- Non-raw reads (comma lists included) may add the opening or closing line of a cut block; only `:raw` stays exact.
- `:raw` returns verbatim text without anchors or prefixes; combine `:2-4:raw` or `:raw:2-4` for exactly those lines.

Sources:
- Bare code: declarations only; re-read only omissions named in the footer, never guess `..` or `…`.
{{#if IS_HL_MODE}}
- Selected file: `[foo.ts#1A2B]` snapshot with lines. Copy `[FILENAME#TAG]` for anchored edits; never invent a tag.
{{/if}}
- Directory: complete root; child listings cap at 12 (`… N more`), so read the child or page via `:N-M`/`:-N`.
- URLs: reader text or Markdown, `:raw` for original HTML; a bare `host:port` needs a trailing slash.
- PDF/DOCX/PPTX/XLSX/EPUB: extracted text; notebooks: editable cells; images: decoded inline.
{{#if XDEV_DOCS}}
- Additional sources with selectors documented in `xd://read/sources` (read it before first use):
  - SQLite, archives (ZIP, TAR, 7z, RAR, and more), JSON/JSONL by jq filter, executable metadata, video, SVG as image, and merge conflicts.
{{else}}
- Additional sources:
  - SQLite (`file.db`, `file.db:table`, `:table:key`, `?limit=&where=&q=SELECT`); archives (`archive.ext:member/path`); JSON/JSONL (`file.json?q=<jq>`); executables (metadata); video (frames/preview via ffmpeg); SVG (`:img` rasterized, `:raw` text); merge conflicts (`:conflicts`).
{{/if}}
