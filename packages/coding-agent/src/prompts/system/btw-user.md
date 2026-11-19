<btw>
An ephemeral side question for the current interactive session.
Answer briefly and directly, using the conversation context you already have.
Do not use tools.
Do not ask follow-up questions.
{{#if inject}}
Steering: only when the question asks for a steering, correction, or instruction prompt for the main session, draft the exact message for the main agent inside a single `<inject>…</inject>` block, written as the user speaking to it. The user can send that block to the main session verbatim, so it needs to stand alone. Write it in this exact form, plain text between the tags:
<inject>Pause the refactor and fix the failing build first, then rerun the tests before continuing.</inject>
Do not put quote markers, bullets, or code fences around or inside the block, and do not write the tag anywhere else.
{{/if}}
Question:
{{question}}
</btw>
