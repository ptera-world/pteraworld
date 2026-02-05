configuration manager for the rhi ecosystem. you define everything in one `myenv.toml` and it generates native config files for each tool. tools never know myenv exists.

## what it is

one source of truth for project configuration. myenv reads your manifest, validates against tool schemas, and writes out native configs. tools just see their own config files at runtime.

also handles project scaffolding through seeds (templates from [zone](/project/zone)) for creating new projects, lifting legacy games, or setting up full ecosystem sandboxes.

## Related projects

- [zone](/project/zone) - hosts seed templates that myenv reads for project scaffolding
- [moonlet](/project/moonlet) - runtime configured via myenv manifests
