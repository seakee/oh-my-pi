<system-injection>
Your last turn stopped during a streamed `edit` call: the harness's final patch preview for the target file reported an error, so the patch was never applied. The turn was cut short on purpose, and this continuation replaces it.

Preview error: {{diagnostic}}

Act on the error now instead of sending the same payload again:
- Read the target file again so your line anchors match its current content.
- Then re-issue the edit with corrected anchors, or use `write` when the change is large.

This is the coding agent recovering from a failed streaming edit preview on its own, not a user instruction.
</system-injection>
