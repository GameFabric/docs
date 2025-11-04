# Contributing to GameFabric Documentation

Thank you for contributing to the GameFabric Documentation! This guide will help you get started.

## Pull Request Title Format

All pull requests **must** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for their titles. This is enforced by an automated lint check.

### Format

```
type(optional-scope): description
```

### Allowed Types

- **build**: Changes to build system or dependencies
- **chore**: Routine tasks, maintenance
- **ci**: CI/CD configuration changes
- **docs**: Documentation changes
- **feat**: New features
- **fix**: Bug fixes
- **perf**: Performance improvements
- **refactor**: Code refactoring
- **breaking**: Breaking changes
- **revert**: Revert previous changes
- **style**: Code style/formatting changes
- **test**: Test additions or modifications

### Examples

#### Good PR Titles ✅

```
docs: add API authentication guide
docs(glossary): link Cordoned term to Site entry
feat: add new multiplayer server configuration
feat(api): add vessel scaling endpoints
fix(api): correct endpoint response format
fix: resolve navigation menu overlap issue
chore: bump dependencies
ci: update GitHub Actions workflow
```

#### Bad PR Titles ❌

```
Add API authentication guide (missing type prefix)
Update glossary (missing type prefix and not descriptive)
Fix bug (too vague)
WIP: working on feature (not following format)
Link Cordoned term to Site entry and extend Site definition (missing type prefix)
```

### Scope (Optional)

The scope is optional and can be used to specify the area of the codebase being changed:

- `glossary`: Changes to glossary documentation
- `api`: Changes to API documentation
- `guide`: Changes to guides
- etc.

### Description

The description should:
- Start with a lowercase letter
- Be concise but descriptive
- Use imperative mood ("add" not "added" or "adds")
- Not end with a period

## Local Development

For development, either use the containerized variant using `make dev`, or use `yarn install` followed by `yarn docs:dev` and navigate to `http://localhost:5173`.

For a production build, use `yarn docs:build`.

## Adding Documentation

To contribute to the documentation, simply edit the relevant files within the appropriate subfolder in `src` or create a new subfolder following the established naming convention.

To include new pages in the navigation, modify the `sidebar.json` file within the respective folder, ensuring you add the order property to maintain the correct sequence in the sidebar.

All changes are automatically integrated into `.vitepress/config.js`. You can refer to existing examples or consult the [Vitepress Documentation](https://vitepress.dev/reference/default-theme-sidebar) for guidance on configuring sidebars.

## Adding API Specs

API Specs are placed in the `src/api` folder using the preexisting component.

To add new specs simply create a new markdown file for the desired spec and add the component as shown in the repository examples.

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.
