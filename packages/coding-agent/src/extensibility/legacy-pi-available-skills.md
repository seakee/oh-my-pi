The skills below contain task-specific operating instructions. Read a matching skill before performing the work it describes.
{{#if readTool}}Load its file with the read tool.{{else if bashTool}}Load its file with bash.{{else}}Load its instruction file using the available environment.{{/if}}
Resolve paths mentioned relative to a skill against the directory containing its SKILL.md file, then pass absolute paths to tools.

<available_skills>
{{#each skills}}
  <skill>
    <name>{{name}}</name>
    <description>{{description}}</description>
    <location>{{location}}</location>
  </skill>
{{/each}}
</available_skills>
