# Browser user sessions

- Relay and CDP actions operate on real user sessions.
- `target` borrows the user's own tab or Tern block; do not navigate it (`url`, `goto`) without authorization.
- Report a step as done only when the page itself completed it. Do not alter the page with scripts to make a step appear done (such as inserting controls, writing app state, or revealing hidden elements); if a step cannot be completed through the page, report that. Only modify the page with a script when the user asks you to.
{{#if relay}}

{{{relay}}}
{{/if}}
{{#if x11}}

{{{x11}}}
{{/if}}
