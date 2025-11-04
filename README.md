# GameFabric Documentation — docs.gamefabric.com

## Contributing

The static files that are shipped to end users are generated using Vitepress.
See the [full documentation on how to use Vitepress](https://vitepress.dev/guide/getting-started).

### Pull Request Guidelines

All pull requests must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for their titles. The PR title format should be:

```
type(optional-scope): description
```

**Allowed types:**
- `build`: Changes to build system or dependencies
- `chore`: Routine tasks, maintenance
- `ci`: CI/CD configuration changes
- `docs`: Documentation changes
- `feat`: New features
- `fix`: Bug fixes
- `perf`: Performance improvements
- `refactor`: Code refactoring
- `breaking`: Breaking changes
- `revert`: Revert previous changes
- `style`: Code style/formatting changes
- `test`: Test additions or modifications

**Examples:**
- `docs: add API authentication guide`
- `docs(glossary): link Cordoned term to Site entry`
- `feat: add new multiplayer server configuration`
- `fix(api): correct endpoint response format`

PR titles are automatically validated by the lint workflow on every pull request.

### Local development

For development, either use the containerized variant using `make dev`, or use `yarn install` followed by `yarn docs:dev` and navigate to `http://localhost:5173`.

For a production build, use `yarn docs:build`.

### Repository Structure

```text
.
├── src/                                            # Vitepress "srcDir"
│   ├── multiplayer-servers/                        # Multiplayer Server specific documentation
│   │   ├── general/                                # Content directories per section, in order
│   │   │   └── sidebar.json                        # Definition of navigation for that section
│   │   ├── api/
│   ├── index.md                                    # Index page
│   ├── public/                                     # Static, global assets
│   │   └── gf.png
├── vite.config.js
├── .vitepress/
│    ├── config.js                                  # Contains code for sidebar rendering and general config
│    └── theme/
│        ├── custom.css
│        └── index.js
├── package.json
├── README.md
└── yarn.lock
```

### Adding Documentation

To contribute to the documentation, simply edit the relevant files within the appropriate subfolder in `src` or create a new subfolder following the established naming convention.
To include new pages in the navigation, modify the sidebar.json file within the respective folder, ensuring you add the order property to maintain the correct sequence in the sidebar.

All changes are automatically integrated into `.vitepress/config.js`. You can refer to existing examples or consult the
[Vitepress Documentation](https://vitepress.dev/reference/default-theme-sidebar) or guidance on configuring sidebars.

### Adding API Specs

API Specs are placed in the `src/api` folder using the preexisting component.

To add new specs simply create a new markdown file for the desired spec and add the following code to it:

```vue
---
layout: page
---

<script setup>
import OpenAPI from '../components/OpenAPI.vue'
</script>

<OpenAPI spec-url="$SPEC_URL"/>
```

Afterwards, it can be referenced in the `.vitepress/config.js`.

---

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://docs.gamefabric.com">GameFabric Documentation</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://nitrado.net">marbis GmbH</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""></a></p>
