code intelligence CLI that works structurally across 98 languages via tree-sitter. navigation, analysis, linting, search, and package management through a single interface.

## what it is

instead of treating source code as text, normalize works with syntax trees (functions, types, modules, imports). core commands:

- `normalize view` - structural outline with line numbers
- `normalize analyze` - codebase health, complexity, hotspots, duplicates, documentation coverage
- `normalize tools` - unified interface to linters, formatters, test runners
- `normalize text-search` - full-text search with ripgrep backend
- `normalize packages` - query package registries (Cargo, npm, pip, Go, and more)

also serves as an MCP server, HTTP REST API, or LSP server. can parse Claude Code session logs and run Lua scripts for automation.

## Related projects

- [moonlet](/moonlet) - normalize is available as a moonlet plugin (moonlet-normalize)
- [zone](/zone) - Lua tooling that leverages normalize for project scaffolding
