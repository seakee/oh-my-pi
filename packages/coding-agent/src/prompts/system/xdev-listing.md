{{prefix}} {{count}} available tools.
{{#each rows}}
{{this}}
{{/each}}

Open `{{prefix}}<tool>` to inspect a tool's documentation and input specification. Execute it by writing a JSON argument object to that address. Directly callable tools also accept this resource-based dispatch.
