federation protocol for persistent worlds. connects independently-operated game servers with single-authority ownership, no distributed state resolution.

## what it is

when a player crosses between worlds, their state is transferred, not replicated. each world instance owns its state completely.

there are two layers: substrate (static, replicated, cacheable - the world's structure) and simulation (dynamic, authoritative, ephemeral - what's actually happening). protocol primitives include manifests, intents, snapshots, and transfers. import policies ("customs") validate player passports when crossing servers, so you can clamp stats, filter items, or reject things explicitly.

if authority dies, the world desaturates and the player becomes an observer, but the substrate stays visible.

## Related projects

- [playmate](/project/playmate) - game primitives for worlds connected via interconnect
