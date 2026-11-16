<irc>
Incoming IRC message from agent `{{from}}`{{#if replyTo}} (reply to {{replyTo}}){{/if}}:

{{message}}

{{#if interrupting}}It arrived while you were waiting or working, and an active interruptible wait stopped early so you could read it now.{{/if}}

{{#if relayOnStop}}If a response is expected, reply with `write` (`path: "agent://{{from}}"`, `content: "…"`) when it is available; otherwise whatever you `yield` or say last this turn is delivered to `{{from}}` when you stop.{{else}}If a response is expected, reply with `write` (`path: "agent://{{from}}"`, `content: "…"`); you may finish the current step first. No one replies on your behalf.{{/if}}
</irc>
