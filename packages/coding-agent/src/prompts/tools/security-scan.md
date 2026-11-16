Repository security scans: plan, start, inspect, cancel, validate.
`preflight`: an immutable plan pinned to the repository snapshot, the model, and the exact OAuth credential.
`start`: turns a plan into a background job.
`status`, `cancel`: operate on a returned operation ID.
`cloud_scans`: Codex Security cloud configurations for the exact selected ChatGPT OAuth account.
`cloud_start`: creates or enables a configuration from `repository_id`, `repository_url`, and `environment_id`; it consumes the account's separate Codex Security cloud allowance and never falls back to a native scan.
`cloud_status`: cloud progress.
`cloud_pull`: moves cloud findings into the canonical security store, readable through `security://`.
Cloud actions require `cloud_configuration_id`; `credential_id` may pin the account.
Security must be enabled in settings.
