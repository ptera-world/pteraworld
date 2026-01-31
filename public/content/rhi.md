a glue layer for computers - finding common abstractions across fragmented domains.

## what it is

every domain has its own tools, formats, and conventions that don't talk to each other. rhi finds the structural overlap and builds unified interfaces. 98 languages share the same code intelligence CLI, 50+ document formats pass through a single IR, and one Rust impl block can project to HTTP, CLI, MCP, WebSocket, and GraphQL simultaneously.

the ecosystem is Rust-first, capability-based, and offline-first. projects interoperate through [portals](/portals) (async-first interfaces inspired by WASI) and compose through [moonlet](/moonlet)'s plugin system.

## key projects

- [normalize](/normalize) - structural code intelligence across 98 languages
- [unshape](/unshape) - constructive media generation
- [server-less](/server-less) - one impl, many protocols
- [rescribe](/rescribe) - lossless document conversion with 50+ formats
- [moonlet](/moonlet) - Lua runtime with plugin system
- [paraphase](/paraphase) - type-driven data conversion route planner
