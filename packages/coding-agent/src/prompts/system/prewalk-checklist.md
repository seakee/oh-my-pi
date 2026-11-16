Before calling the task complete, verify:

- Consistency: if a pattern, signature, or check changed in one place, grep every other callsite or duplicate copy that needs the same change. A fix applied to only some matching sites fails.
- Scope: if the diff exceeds the minimal change that resolves the issue, confirm behavior is unchanged outside the reported issue. Prefer the smallest correct diff over a broader rewrite.
- Verification: run the issue's full test module or file, not only the test expected to flip. A change that breaks a sibling test fails.

Do not claim the task is complete until all three checks are done.
