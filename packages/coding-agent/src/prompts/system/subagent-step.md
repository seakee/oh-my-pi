{{#each steps}}
# Step {{number}} of {{total}}
{{text}}
{{/each}}
{{#if last}}
Final {{#if multiple}}steps{{else}}step{{/if}}: your {{#if structured}}terminal `submit_output`{{else}}final message{{/if}} is the result of the entire assignment and must cover every step.
{{else}}
Complete only {{#if multiple}}these steps{{else}}this step{{/if}}, then report {{#if structured}}with a terminal `submit_output`{{else}}as your final message{{/if}}. Step {{next}} arrives next; do not start it early.
{{/if}}
