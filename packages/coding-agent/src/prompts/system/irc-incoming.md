<irc>
Incoming IRC message from agent `{{from}}`{{#if replyTo}} (reply to {{replyTo}}){{/if}}{{#if progress}} (progress; its reply follows later){{/if}}:

{{message}}

{{#if interrupting}}It arrived while you were waiting or working, and an active interruptible wait stopped early so you could read it now.{{/if}}

{{#unless progress}}{{#if relayOnStop}}If a response is expected, reply with `write` (`path: "agent://{{from}}"`, `content: "…"`) when it is available; otherwise whatever you submit via `submit_output` or say last this turn is delivered to `{{from}}` when you stop.{{else}}If a response is expected, reply with `write` (`path: "agent://{{from}}"`, `content: "…"`); you may finish the current step first. No one replies on your behalf.{{/if}} Send any acknowledgement or progress note before the real answer to `agent://{{from}}?progress` so `{{from}}` keeps waiting for the answer.{{/unless}}
</irc>
