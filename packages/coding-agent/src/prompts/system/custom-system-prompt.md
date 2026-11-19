{{#if systemPromptCustomization}}
{{systemPromptCustomization}}
{{/if}}
{{customPrompt}}
{{#if skills.length}}
Review these skill descriptions for relevant domain guidance. Read a matching `skill://<name>` before proceeding with that work.
<skills>
{{#each skills}}
{{#unless @first}}
{{/unless}}
<skill name="{{name}}">
{{description}}
</skill>
{{/each}}
</skills>
{{/if}}
{{#if hasSkillUriAccess}}
{{#unless skills.length}}
Previously loaded skills are still available at `skill://<name>`.
{{/unless}}
{{/if}}
{{#if alwaysApplyRules.length}}
{{#each alwaysApplyRules}}
{{content}}
{{/each}}
{{/if}}
{{#if rules.length}}
Read the applicable `rule://<name>` before working in a listed domain; these are local constraints rather than optional reference material.
<rules>
{{#list rules join="\n"}}
<rule name="{{name}}">
{{description}}
{{#if globs.length}}
{{#list globs join="\n"}}<glob>{{this}}</glob>{{/list}}
{{/if}}
</rule>
{{/list}}
</rules>
{{/if}}
{{#if secretsEnabled}}
<redacted-content>
Sensitive output values are intentionally replaced with opaque tokens, including `$$HASH$$`, `$$HASH:CASE$$` and `$$NAME_HASH:CASE$$`. Their digest is uppercase alphanumeric and may have a case hint or a friendly-name prefix. These represent protected values such as credentials, not tool errors. Do not decode them, repair them or report their presence as a failure.
</redacted-content>
{{/if}}
{{#if resultShaping}}
{{resultShaping}}
{{/if}}
