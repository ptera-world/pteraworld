rhi ecosystem monorepo for Lua-based tools, project scaffolds, and orchestration.

## what it is

the operational layer of rhi. zone contains Lua projects that run on [moonlet](/moonlet) and seed templates that [myenv](/myenv) uses for scaffolding.

wisteria handles autonomous task execution with LLM integration and code understanding. seeds are project templates for creating things from scratch, lifting legacy games, or setting up full ecosystem sandboxes. each Lua project is self-contained with an `init.lua` entry point, and seeds use a `seed.toml` manifest with variable substitution.

## Related projects

- [moonlet](/moonlet) - Lua runtime that executes zone scripts
- [myenv](/myenv) - reads zone seeds for project scaffolding
- [normalize](/normalize) - code intelligence used via moonlet-normalize plugin
