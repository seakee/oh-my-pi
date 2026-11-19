# Browser Relay

The browser relay is on: `browser.open` without `app` drives the user's own Chrome, signed in as them. {{#if cdpUrl}}Pass `app: "auto"` to open in the browser at `browser.cdpUrl` ({{cdpUrl}}) instead.{{else if tern}}Pass `app: "auto"` to use the client's own Tern picture-in-picture instead.{{else if cmux}}Pass `app: "auto"` to use the client's own cmux browser surface instead.{{else}}Pass `app: "auto"` to use a throwaway managed browser instead.{{/if}}
