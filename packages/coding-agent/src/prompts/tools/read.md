Use `read` for static web content; use the browser only when a page needs script execution.

Line ranges go in `path`, not in separate range/offset/limit parameters: `{"path":"notes.txt:450-455"}` reads lines 450-455, and `{"path":"notes.txt:-5"}` reads the last 5. Put the selector on every ranged call; repeating a bare path does not advance through the file.

Suffixes: `:50` or `:50-` starts at line 50; `:50-200` is inclusive; `:50+150` counts 150 lines from 50; `:-60` is the last 60; commas join ranges (`:5-16,960-973`) or individual lines (`:19,59`). A single non-raw range also shows one line before and three after, so `:50-80` shows 49-83; non-raw reads, comma lists included, may add the opening or closing line of a cut block. `:raw` stays exact: it returns lines verbatim without anchors or prefixes. Combine it as `:2-4:raw` or `:raw:2-4` for exactly those lines; beside `:raw` a bare number is that single line (`:17:raw`), while `:17-:raw` runs on. `:conflicts` lists one unresolved merge block per line. SVG and SVGZ read as text by default; `:img` rasterizes them into an image and `:raw` returns the original. Raster images (PNG, JPEG) take no selector, and `:img` rejects them. Video needs ffmpeg/ffprobe: without a selector you get a preview grid and metadata, `:412` is one frame, and `:1h5m42s`, `:90s`, or `:01:23` is a timestamp.

What each source returns:

- Bare code: declarations only. Re-read only the omissions the footer names; never guess `..` or `…`.
{{#if IS_HL_MODE}}- Selected file: `[foo.ts#1A2B]` snapshot with lines. Copy `[FILENAME#TAG]` for anchored edits; never invent a tag.
{{/if}}- Directory: the complete root; child listings stop at 12 (`… N more`), so read the child, or page with `:N-M`/`:-N`.
- SQLite: `file.db` lists tables; `:table` shows schema and rows; `:table:key` looks up by primary key; `?limit=`, `?where=`, and `?q=SELECT` filter.
- Archives: ZIP/JAR/APK/WHL, compressed TAR, RAR/7z/ISO/CAB/DEB/RPM/CPIO/AR/LZH/ARJ/ASAR, and compressed streams; address a member as `archive.ext:member/path`.
- JSON/JSONL/NDJSON: `file.json?q=<jq filter>`; `&raw=true` prints unquoted strings, `&compact=true` one-line values, and `&offset=`/`&limit=` page results; write `&` inside the filter as `%26`.
{{#if BINARY_VIEWS}}- Executables (ELF/PE/Mach-O, with or without an extension): overview plus function list; `:<func|0xaddr>` pseudocode, `:<func>:asm`, `:imports`, `:exports`, `:strings`, `:xrefs:<func|0xaddr>`. Line ranges apply after the view (`bin:main:10-40`). A universal Mach-O shows the host-architecture slice; `bin:@<arch>` selects another (`bin:@x86_64:main`).
{{/if}}- PDF and documents: extracted text. Notebooks: editable cells. Images: decoded inline. URLs: reader text or Markdown, `:raw` for the original HTML; a bare `host:port` needs a trailing slash.
