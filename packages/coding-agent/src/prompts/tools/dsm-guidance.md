Binary analysis lives in execute_code's `dsm` namespace{{#if xdevDocsReadable}}; read `xd://eval/dsm` before use{{/if}}. Bare executable reads show metadata only.

To share a database with a child agent, pass the string from `db.handle()` in its task or context. The child needs to call `await dsm.open(handle)` to retain its own reference and close its handle in `finally`. Keep the parent's reference alive until the children finish, and do not pass a process-local database object or assume its variable exists in a child.
