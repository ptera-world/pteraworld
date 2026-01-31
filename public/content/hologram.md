Discord bot for collaborative worldbuilding and roleplay. everything is an entity with facts, responses are controlled declaratively, and it talks to 15+ LLM providers.

## what it is

everything in hologram is an entity with facts - characters, locations, items, help topics, all represented the same way. responses are controlled via `$respond` directives (always/never/conditional) and `$if` expressions for things like rate limiting, mention detection, or random triggers.

entities can share channels (via XML tags or name prefixes), use custom Nunjucks templates with inheritance, and override which model they use. there's a tool system for fact manipulation via LLM tool calls, and bindings map Discord channels, users, and servers to entities for persona dispatch.

supports streaming responses with configurable chunking. built with Bun, Discordeno, Vercel AI SDK v6, and bun:sqlite.

## Related projects

- [aspect](/aspect) - identity exploration sandbox; cards could become hologram entities
