## Auto-Learn (experimental)

`manage_skill`: build a reusable managed-skill library.
Managed skills are `SKILL.md` files in the isolated `~/.omp/agent/managed-skills`, surfaced in future sessions like any other skill.

For repeatable procedures worth codifying (setup sequences, debugging recipes, project-specific workflows), use `manage_skill` to `create`, `update`, or `delete`.
Isolation: managed skills are the only writable skills. Never edit user-authored skills in `~/.omp/agent/skills` or `.omp/skills`.
Capture sparingly and specifically: a skill needs reuse, and enhancing an existing managed skill beats creating a near-duplicate.
