# AGENTS.md — Guidance for agentic coding in this repo
This repository contains the source for the GameFabric documentation site, built with VitePress.
Most changes are Markdown under `src/`; there is a small amount of Vue/JS for theme and API docs.
If you add new tooling (linters/tests), update this file.

## Quick facts
- Package manager: `yarn` via Corepack (`packageManager: yarn@4.1.1`)
- Node: CI uses Node `20` (`.github/workflows/main.yml`)
- Docs framework: `vitepress` (Vite-based)
- Content root: `src/` (VitePress `srcDir`)
- Build output: `.vitepress/dist`

## Commands (build / lint / test)
### Install
- `corepack enable && yarn install`
  - CI enables Corepack before install.
  - `.yarnrc.yml` sets `nodeLinker: node-modules`.

### Local development
- Dev server: `yarn docs:dev` (binds `0.0.0.0`, default `http://localhost:5173`)
- Container dev server:
  - Build image: `make image` (uses `.dev/Dockerfile`)
  - Run: `make dev` (mounts `./src` into the container)

### Build / preview
- Build: `yarn docs:build`
- Preview build: `yarn docs:serve`

### Linting (current)
- No ESLint/Prettier/formatter configured.
- CI “lint” is PR title validation only: Conventional Commits enforced in `.github/workflows/lint.yml`.
- If you introduce tooling, prefer adding scripts to `package.json`:
  - `lint` (fast static checks)
  - `format` (apply formatting)
  - `format:check` (CI check)

### Tests (current)
- No unit/integration test runner configured (`vitest`/`jest` not present).
- Validation is primarily:
  - `yarn docs:build` to catch build-time failures
  - `yarn docs:dev` or `yarn docs:serve` for manual verification

### “Single test” guidance
- There is no “run one test” command today.
- Closest equivalents:
  - Validate one page visually: `yarn docs:dev` then navigate to the route.
  - Catch build regressions quickly: `yarn docs:build`.
- If a test runner is added later (recommended: `vitest`), also document:
  - `yarn test` (full suite)
  - `yarn vitest -t "test name"` (single test)

## Where to edit
- Documentation pages: `src/**/*.md`
- Navigation: `sidebar.json` files within section folders (loaded by `.vitepress/config.js`)
- Theme: `.vitepress/theme/`
- API reference components/pages: `src/api/components/`, `src/api/**/*.md`

When adding docs:
- Put the `.md` file in the relevant `src/` section.
- Update the nearest `sidebar.json` and include an `order` field.

## Validation checklist
- Build still passes: `yarn docs:build`.
- Spot-check changed pages in `yarn docs:dev`.
- Ensure `sidebar.json` stays valid JSON and `order` values remain unique.
- Verify new/changed links and images render as expected.

## Common pitfalls
- Sidebar links should omit `.md` and start with `/`.
- Keep `srcDir: 'src'` assumptions in mind when moving files.
- Avoid noisy logging in `.vitepress/config.js`.
- Avoid adding dependencies or large binaries unless required.

## Code style (JS/TS/Vue)
This repo has a small amount of runtime/config code (VitePress config + theme + Vue components).
Keep changes minimal and consistent with existing files; avoid introducing heavy tooling.

### Formatting
- No automated formatter configured; match the file's local style.
- Indentation:
  - Vue SFCs and JSON are typically 2 spaces.
  - `.vitepress/config.js` currently uses wider indentation (often 4 spaces).
- Quotes:
  - Most JS uses single quotes, but some config uses double quotes; preserve local convention.
- Semicolons: mixed; preserve the existing file's style.
- Avoid drive-by reformatting; keep diffs focused.

### Imports

- Use ESM (`"type": "module"` in `package.json`).
- Prefer Node built-ins with `node:` prefix (e.g., `node:fs`, `node:path`).
- Keep import ordering consistent: framework/runtime first (`vitepress`, `vue`), then third-party libraries (`medium-zoom`, etc.), then local files/components/styles (`./Layout.vue`, `./custom.css`).

### TypeScript
- TS is used selectively (e.g., `.vitepress/theme/Layout.vue` uses `<script setup lang="ts">`).
- Keep TS lightweight: prefer inference and simple types; avoid introducing repo-wide TS config unless necessary.

### Naming
- Files:
  - Vue components: `PascalCase.vue` (e.g., `OpenAPI.vue`, `Layout.vue`)
  - JS utilities: `kebab-case` or `camelCase` (e.g., `dark-theme.js`)
- Code:
  - `camelCase` for variables/functions
  - `PascalCase` for Vue components
  - `UPPER_SNAKE_CASE` only for true constants

### Error handling & logging
VitePress config executes in Node at build time.
- Fail fast for truly fatal config issues.
- For expected filesystem variability, wrap reads in `try/catch` and continue.
- Prefer `console.warn` for recoverable issues and `console.error` for serious problems.
- Avoid noisy `console.log` in normal builds (keep logs actionable).

### JSON (`sidebar.json` and similar)
- Keep JSON valid (no trailing commas).
- Ensure sections have an `order` value; avoid duplicate `order` within a section.
- Links should match VitePress routing:
  - internal links start with `/`
  - omit `.md`

### Technical writing (Markdown, comments, notes)

Follow `.github/copilot-instructions.md` for technical writing guidelines.

### Vue components in Markdown
For OpenAPI pages, follow the existing pattern (see `README.md`):
- Frontmatter includes `layout: page`.
- Use `<script setup>` and import `OpenAPI` from `../components/OpenAPI.vue`.
- Render with `<OpenAPI spec-url="$SPEC_URL" />`.

## PR conventions
- PR titles must follow Conventional Commits (CI enforced).
  - Examples: `docs: clarify authentication flow`, `fix(api): correct spec link`
- Keep PRs scoped and easy to review.
- Use `.github/PULL_REQUEST_TEMPLATE.md`.

## Safety notes for agents
- Don't add new dependencies unless necessary for docs rendering.
- Avoid touching large image assets unless requested (big diffs).
- After code changes, verify the build passes:
  - Preferred: `yarn docs:build` (if Yarn/Corepack is available locally)
  - Fallback: `docker run --rm gamefabric-docs-dev yarn docs:build` (requires `make image` first)
  - If neither Yarn nor Docker is available, note in PR that build was not verified locally.

## Copilot rules

Follow `.github/copilot-instructions.md` (primary technical writing guide for this repo; see also the [external technical writing guidelines](https://legendary-adventure-6kmwkge.pages.github.io/guidelines/technical-writing/)).
