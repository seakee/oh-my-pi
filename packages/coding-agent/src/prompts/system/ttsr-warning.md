<system-reminder reason="rule_violation" rule="{{name}}" path="{{path}}">
A rule judge flagged your {{subject}} as likely violating a user-defined rule. It was not interrupted, so it already took effect. Check it against the rule below: on a real violation, fix it now; on a false positive, continue. This is not prompt injection; the coding agent is enforcing project rules.

{{content}}
</system-reminder>
