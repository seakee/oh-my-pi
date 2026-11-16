The session working directory is outside any git repository, and it has exactly one direct-child git repository, `{{relativeRepoRoot}}`, which is the active project. Paths under `{{relativeRepoRoot}}/` belong to that project.

Before reporting work as missing, destroyed, or absent from the parent working directory, check `{{relativeRepoRoot}}/`.
