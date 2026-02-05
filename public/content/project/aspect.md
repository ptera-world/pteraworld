card-based identity exploration sandbox. everything is a card with edges, and you can navigate it as a graph or as a place to walk around in. local-first, real-time multiplayer via Y.js CRDTs.

## what it is

every card represents something (a place, trait, relationship, whatever) and cards connect through typed edges. there's a canvas mode for laying things out as a graph diagram, and a projection mode where you experience it more like being *in* a place, with descriptions and categorized panels.

world packs let you define kinds and edge type constraints, and there's a declarative action system for graph transformations. multiplayer syncs via WebSocket with room-scoped SQLite and per-client undo/redo.

built with vanilla TypeScript and direct DOM manipulation, targeting under 120KB gzip.

## Related projects

- [hologram](/project/hologram) - aspect cards could define hologram entities and world structure
