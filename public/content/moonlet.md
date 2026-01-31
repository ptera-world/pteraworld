Lua runtime with a plugin system for agentic AI execution. multi-provider LLM client, SQLite-backed memory, dynamic C ABI plugin loading, and capability-based security.

## what it is

the scripting backbone of rhi. moonlet is a LuaJIT runtime where Rust crates expose functionality to Lua scripts via C ABI plugins. scripts get capabilities through a `caps` table, no ambient authority.

plugins include an LLM client (Anthropic, OpenAI, Azure, Gemini, Cohere, DeepSeek, Groq, Mistral, Ollama, OpenRouter, Perplexity, Together, XAI), embedding generation, SQLite-backed memory with metadata and weights, capability-based filesystem access, code analysis via [normalize](/normalize), session management, tool execution, and package management.

## Related projects

- [normalize](/normalize) - available as moonlet-normalize plugin
- [portals](/portals) - moonlet uses portals-io and portals-filesystem
- [zone](/zone) - Lua projects run on moonlet
- [dew](/dew) - Lua backend for moonlet
