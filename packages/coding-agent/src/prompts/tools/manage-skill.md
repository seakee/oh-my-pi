A managed skill is a `SKILL.md` in the isolated `~/.omp/agent/managed-skills` directory, surfaced as a normal skill in future sessions.

Use it for repeatable procedures worth codifying: a setup sequence, a debugging recipe, a project-specific workflow. User-authored skills stay separate, and this tool never edits them.

- `action: "create"` fails when the skill already exists.
- `action: "update"` overwrites the body and fails when the skill is absent.
- `action: "delete"` fails when the skill is absent.

`name`: kebab-case (lowercase letters, digits, hyphens).
`description`: specific, since it drives discovery.
Put no frontmatter in `body`; it is generated from `name` and `description`.
