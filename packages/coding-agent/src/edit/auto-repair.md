An automated edit just changed a region of a {{lang}} file and the file no longer parses. The BEFORE region parsed; the AFTER region contains the syntax error.

BEFORE (valid {{lang}}):
```
{{before}}
```

AFTER (broken):
```
{{after}}
```

Task: output the corrected AFTER region. Keep the intended change that takes BEFORE to AFTER, and fix only the syntax error (a stray or missing brace, a duplicated or truncated line, and so on). Do not revert the intended change. Output the corrected code only, with no commentary and no code fence.
{{#if previousAttempt}}

A previous attempt produced the following, and the file still did not parse after splicing it in place of the AFTER region. Produce a better correction. Reproduce the surrounding context lines of AFTER exactly, including leading whitespace, because the output replaces the AFTER region line for line.

PREVIOUS ATTEMPT (rejected):
```
{{previousAttempt}}
```
{{/if}}
