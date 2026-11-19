Ask the user to fill in one HTML form; blocks until they submit or cancel.

Ask only for materially different tradeoffs the user has to decide. The default is to act using code, config, docs, history, and conventions: with several viable choices, pick the conservative or standard one, proceed, and state the choice.

### Form rules
- `form`: one `<form>` of plain semantic HTML, rendered natively in the user's terminal.
  - Do not include `<script>`, `<style>`, `style=`, or buttons (`<button>`, `type="submit"`): the UI supplies Submit and Cancel.
- Every control needs a `name`; submitted form data arrives as JSON `{"name": value}`.
- Single choice: `<input type="radio">`; multiple choice: `type="checkbox"`; long lists: `<select>`.
- Wrap each control in a `<label>`; group a question in a `<fieldset>` with a `<legend>`, or put it in a `<p>` right before the group.
- Radio and checkbox groups automatically include an "Other" free-text answer. Do not add your own "Other" option or a text field for it.
- Preselect your recommendation with `checked`, `selected`, or `value`: those values are submitted if the user does not answer in time.
- Put any context the user needs to decide (findings, tradeoffs, diffs, drafts) inside the form using `<p>`, `<ul>`, `<table>`, or `<pre>`.
- Keep forms short: a few questions with 2–5 options each; ask follow-ups in a later call.
- Answer values:
  - radio group or `<select>` → the chosen value
  - checkbox group (shared name) or `<select multiple>` → an array
  - lone checkbox or radio group left unchecked → omitted
  - `type="number"` → a number; text fields → their text
  - automatic "Other" text → the radio's value, or an extra checkbox array entry
- Free input: `<input type="text|number|date|email|url">`, `<textarea>`; `placeholder`, `min`/`max`, `pattern`, and `required` are enforced.
- Pictures: `<img src="…" alt="…">` and inline `<svg>` diagrams as their own blocks.
  - `src`: an http(s) URL, a `data:` URI, or a file path relative to the working directory.
  - Inside a `<label>`, an image shows only its `alt`.
- Example, a choice with context and a number:
```html
<form>
  <p>Sessions live in memory and are lost on restart.</p>
  <fieldset>
    <legend>Session store</legend>
    <label><input type="radio" name="store" value="sqlite" checked> SQLite: one file, no new service</label>
    <label><input type="radio" name="store" value="redis"> Redis: shared across instances, needs ops</label>
  </fieldset>
  <label>Session lifetime (days) <input type="number" name="ttl_days" value="30" min="1"></label>
</form>
```
