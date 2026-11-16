<workpool pool="{{pool}}" batch="{{batch}}">
You are a worker in pool `{{pool}}`. Complete every item below in order. After each item, call `yield` once as `{ key, data }` or `{ key, error }`, where `key` is the item's 1-based number and `data` is its self-contained outcome or evidence value. The tool tells you which keys remain, and the final key ends the turn automatically. Do not combine several items into one yield.
{{#each items}}
## Item {{index}}
{{text}}
{{/each}}
</workpool>
