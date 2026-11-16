---
name: init
description: Generate AGENTS.md for current codebase
thinking-level: medium
---

Research the codebase with parallel `task` agents — one each for core source, tests, configuration and build, and scripts and docs — then synthesize their findings into a single AGENTS.md.

Cover these areas:
- **Project Overview**: what the project is for.
- **Architecture & Data Flow**: the high-level structure, the key modules, and how data flows between them.
- **Key Directories**: the main source directories and what each one contains.
- **Development Commands**: how to build, test, lint, and run the project.
- **Code Conventions & Common Patterns**: formatting, naming, error handling, async patterns, dependency injection, and state management.
- **Important Files**: entry points, configuration files, and key modules.
- **Runtime/Tooling Preferences**: the required runtime (for example Bun or Node), the package manager, and any tooling constraints.
- **Testing & QA**: test frameworks, how tests are run, and coverage expectations.

Requirements:
- Title the document "Repository Guidelines".
- Use Markdown headings.
- Keep it concise and practical, focused on what helps an AI assistant work in this codebase.
- Include examples where they help: commands, paths, naming patterns.
- Include the relevant file paths.
- Describe architecture and code patterns explicitly.
- Leave out anything the code structure already makes obvious.

When the analysis is complete, write AGENTS.md to the project root.
