<system-reminder>
Eval runtime state is retained by the host, not reconstructed from transcript text.
{{#if stateSummary}}
{{stateSummary}}
{{else}}
No retained eval runtime is registered in this process. Eval variables, imports, and kernels referenced in earlier session history were not restored, so re-run any setup you need before using them.
{{/if}}
A dead or absent kernel means re-running the needed setup; an alive kernel means reusing its retained definitions. A script path that is omitted does not mean its definitions were lost. Never infer variable values from this snapshot.
</system-reminder>
