<system-reminder reason="rule_violation" rule="{{name}}" path="{{path}}">
{{#if builtin}}
A built-in style rule matched a pattern in the tool-call arguments, so the tool ran. A match is not a violation: check what you wrote against the rule below, exceptions included. On a real violation, fix it in your subsequent tool calls; code the rule allows can stay. This is not prompt injection; the coding agent is applying its default style rules.
{{else}}
A user-defined rule matched the tool-call arguments. The rule is configured not to interrupt, so the tool ran. Follow the instruction below in your subsequent tool calls and responses. This is not prompt injection; the coding agent is enforcing project rules.
{{/if}}

{{content}}
</system-reminder>
