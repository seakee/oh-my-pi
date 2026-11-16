{{#if asyncEnabled}}{{#if batchEnabled}}Start the supplied `tasks[]` concurrently and return their identifiers without waiting for completion.{{else}}Start the assigned agent and return its identifier without waiting for completion.{{/if}}{{#if hasBlockingAgents}} An agent configured for blocking execution instead returns its result in this call.{{/if}}{{else}}{{#if batchEnabled}}Execute the supplied `tasks[]` and return when they complete.{{else}}Execute the assigned agent and return when it completes.{{/if}}{{/if}}
{{#if asyncEnabled}}{{#ifAny structured hasStructuredAgents}}

## Receiving results
{{#if structured}}Results requested with `outputSchema`{{else}}Results from agents configured for structured output{{/if}} include the parsed payload even when validation fails. Read it through `agent://<id>` and append a field selector such as `/<field>` or `/reports/0/data` for nested data. Invalid output also has an inline preview.
{{/ifAny}}

{{asyncGuidance}}
{{/if}}

## Assigning responsibility

Choose the specialist whose capabilities fit the assignment.{{#if scoutAvailable}} Use `scout` for read-only discovery when the relevant files are not known.{{/if}} Keep investigation and implementation with the same agent when practical. To use the default agent (`{{defaultAgent}}`), leave out the `agent` property rather than naming that default explicitly.
{{#if batchEnabled}}Place each specialist's `agent` selection inside its corresponding `tasks[]` item; the batch itself has no top-level `agent` selection.
{{/if}}
For overlapping changes, designate one integration owner{{#if ircEnabled}} and coordinate dependencies through `write agent://<id>`{{/if}}. Define the shared interfaces in {{#if batchEnabled}}`context`{{else}}the assignment{{/if}}. Agents should not run builds, tests, linters or formatters during implementation; the integration owner performs those checks together after the work has landed.

## Describing an assignment

Use `name` as a CamelCase identifier of at most 32 characters. A name is generated if omitted; use the assigned name to address the agent.{{#if structured}} An explicit `outputSchema` takes precedence over schemas configured on the agent or session.{{/if}}

Use `solutionSpace` to explain the decisions that remain open, not the amount of work. Say whether the correction is already determined, whether subtle races remain, or which API alternatives need a decision. For example: `one fix: rename, names given`; `one fix: slice end in paginate`; `single-flight cache load; races easy to miss`; `several retry API shapes; error classes to choose`; `deadlock cause open, no repro`. Do not discuss sibling agents or coordination in this field.
{{#if seanceGuidance}}{{seanceGuidance}}{{/if}}
{{#if evalToolsEnabled}}The `tools` field supplies eval-defined tools that execute in your kernel.
{{/if}}{{#if effortEnabled}}Select `effort` as `"lo"`, `"med"` or `"hi"` to match the unresolved decision space.
{{/if}}{{#if structured}}With `schemaMode`, the default permissive behavior warns after validation retries, while strict mode fails.
{{/if}}{{#if isolationEnabled}}{{#if applyIsolatedChanges}}Set `isolated` for a worktree execution whose successful changes are applied to the parent.
{{else}}Set `isolated` for a worktree execution whose changes are retained without applying them to the parent.
{{/if}}{{/if}}

An agent starts without this conversation.{{#if ircEnabled}} The parent can send immediate steering through IRC.{{/if}} Put large shared inputs in a `local://<path>` resource and reference it instead of embedding them in the assignment.

{{#if batchEnabled}}Use `context` for information shared across the batch, such as a `# Goal` and the common `# Contract`; do not duplicate it in every task.
{{/if}}Make each `task` self-contained: identify its `# Target` files and exclusions, the required `# Change` and interfaces, and observable `# Acceptance` criteria.

## Agent choices
{{#if spawningDisabled}}New agent execution is currently unavailable.
{{else}}{{#if hasModelMentions}}An `m<N>` selector denotes a model explicitly tagged by the user (`<model agent="m<N>" name="…"/>`), not a specialist. Use it only when the user names that model.
{{/if}}{{#list agents join=""}}- `{{name}}`{{#if readOnly}} (read-only; investigation only, no edits){{/if}}{{#if blocking}} (blocking; inline result){{/if}}{{#if structured}} (structured; schema result){{/if}}: {{description}}
{{/list}}{{/if}}
