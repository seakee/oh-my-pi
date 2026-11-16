[The user invoked the "{{name}}" skill; follow its instructions. The full skill follows.]

{{body}}

---

[Skill directory: {{baseDir}}]
Resolve relative paths in this skill (for example `scripts/foo.js` or `templates/config.yaml`) against this absolute directory. Read the referenced assets and templates, and run scripts with the terminal tool when the skill instructions call for it.
{{#if userArgs}}
User: {{userArgs}}
{{/if}}
