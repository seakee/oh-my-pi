Note: when this run ended, macOS secure input was enabled{{#if secureInputApp}}, held by `{{secureInputApp}}`{{/if}}: a password field holds keyboard focus, or a terminal's secure keyboard entry is enabled.
- While active, macOS hides keyboard events from the host, so the user's Escape key will not stop takeover input and user typing will not interrupt a call with `UserIntervened`.
- Input is still delivered; `capabilities()` reports `secureInput` and `globalEscape: false` until secure input ends.
