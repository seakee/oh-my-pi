<workpool pool="{{pool}}" batch="{{batch}}">
You are a worker in pool `{{pool}}`. Complete every item below in order.
After each item, call `submit_output` once as `{ key, data }` or `{ key, error }`:
- `key`: the item's 1-based number.
- `data`: its self-contained outcome or evidence value.

The tool tells you which keys remain; the final key ends the turn automatically.
Do not combine several items into one `submit_output` call.
{{#each items}}
## Item {{index}}
{{text}}
{{/each}}
</workpool>
