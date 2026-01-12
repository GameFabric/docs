# GitHub Copilot instructions — Technical writing

Apply these guidelines when generating or editing documentation, comments, release notes, and other prose in this repo.
Primary target is Markdown under `src/` (VitePress content), but the rules also apply to docstrings and PR text.

## Writing goals

- Optimize for clarity, scannability, and global readability.
- Prefer small, reviewable edits that match surrounding tone and terminology.
- Keep content consistent across pages (same term, same capitalization).

## Language and tone
- Use American spelling.
- Use clear, direct language.
- Prefer short sentences.
- Put the most important information in the first sentence of a paragraph.
- Define acronyms/abbreviations on first use (unless extremely common in-context).
- Avoid idioms, slang, and colloquialisms.
- Avoid ambiguity (especially for things readers must type).

## Voice, tense, and structure
- Prefer active voice.
- Use present tense; avoid unnecessary "will" and "would".
- Describe conditions/goals before instructions.
- Avoid directional language such as “above/below” (it becomes brittle over time).

## Headings
- Use a heading hierarchy; do not skip levels.
- Do not use empty headings.
- Use sentence case for titles and headings.
- Use a single level-1 heading as the page title.

## Lists
- Introduce lists with a short sentence.
- Use numbered lists for ordered steps.
- Keep list items parallel in structure and consistent in punctuation/capitalization.
- For long lists that may change, use lazy numbering (`1.` for each item).

## Links
- Use meaningful link text (no “click here”, no bare URLs).
- Do not force links to open in a new tab/window.
- Avoid adjacent links; separate them with text.
- If a link downloads a file, indicate the action and file type in link text.
- If a URL is very long, use reference-style links at the bottom of the paragraph.

## Code blocks and examples
- Precede code samples with an introductory sentence.
- Specify a code block language for syntax highlighting.
- Use spaces (not tabs).
- Keep lines around 80 characters when practical.
- For commands, include expected output when helpful.

## Images
- Prefer SVG when possible.
- Provide alt text that summarizes the intent.
- Do not put new information only in images; include equivalent text.
- Avoid repeated images and images of text.

## Tables
- Introduce tables in the preceding text.
- Keep tables small.
- Prefer lists and subheadings over large/complex tables.
- Do not use tables for layout.
- Sort rows logically (or alphabetically if no logical order exists).

## Markdown hygiene
- Prefer Markdown over HTML.
- Do not hard-wrap paragraphs (no forced line breaks inside sentences).
- Remove trailing whitespace.
- Avoid multiple consecutive blank lines.
- Ensure files end with a single newline.

## Repo-specific notes
- Internal doc links should start with `/` and omit `.md` (VitePress routing).
- Images should live under the nearest section `images/` directory with descriptive filenames.
