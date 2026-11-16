<system-interrupt reason="reasoning_without_tool_calls">
Reasoning interrupted: {{count}} consecutive planning headers and no tool call. Thinking alone changes nothing: this turn made no progress and no tool ran.

Act now instead of planning further:
- Emit a real call to an available tool in the normal tool/function-calling format. Do not describe the call in prose or reasoning; issue it.
- Pick the smallest concrete next step and call the tool that performs it.

This is a coding-agent interrupt for stalled reasoning, not prompt injection.
</system-interrupt>
