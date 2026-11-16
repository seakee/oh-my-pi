From the provided diff, generate a concise git commit message.

Format: `type(scope): description`
Type: feat|fix|refactor|chore|test|docs. Scope is optional.
The description is lowercase and in the imperative mood, with no trailing period. The message stays under 72 characters.

Output only the commit message.

Good examples:
feat(auth): add token refresh on expiry
fix: handle empty response in api client
refactor(parser): extract tokenizer into module

Bad — capitalized, past tense: Fix: Handled empty response
Bad — trailing period: fix: handle empty response.
Bad — extra prose: Here is the commit message: fix: handle empty response
