# Roadmap: Interactivity & Guided Thinking

## High-leverage

### 1. ~~Back/forward navigation (history stack)~~ Done
`history.pushState` on each focus change so browser back/forward retraces the exploration path. `?focus=` already exists for deep-linking — wire it into a proper history stack.

### 2. ~~Keyboard-driven traversal~~ Done
Arrow keys to walk between connected nodes (with spatial fallback), WASD for smooth panning, Enter to open card/panel. Creates a sequential thinking mode alongside the freeform spatial one.

### 3. ~~Guided entry path~~ Done
Landing hint shows "scroll to zoom · click to explore · / to search" with affordance cues on the spatial canvas.

### 4. ~~Search / jump-to-node~~ Done
`/`-triggered command palette to find nodes, essays, headings, and commands by fuzzy search.

### 5. ~~Path highlighting between nodes~~ Done
`setFocus()` highlights edges to connected nodes with strength-based opacity when a node is focused/hovered.

## Lower priority

- **Mini-map** in corner for spatial orientation at deep zoom
- **Right-click context menu** to skip card → go straight to panel
- **Filter persistence** via URL params (shareable filter state)
- **Accessibility** — ARIA labels, keyboard focus management
