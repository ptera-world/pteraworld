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

### 6. ~~Right-click context menu~~ Done
`<context-menu>` web component with "Open details" (skip card → panel) and "Open in new tab" commands. Right-clicking a node navigates to it first so context is correct.

### 7. ~~Filter persistence via URL params~~ Done
Active filter tags serialized to `?filter=tag1,tag2` via `replaceState`. Restored on page load and popstate. Preserves existing `?focus=` param.

### 8. ~~Accessibility~~ Done
ARIA roles/labels on viewport (`role="application"`), nodes (`role="button"`), card (`role="dialog"`), panel (`role="complementary"`), filter pills (`aria-pressed`), collapsible sections (`aria-expanded`). Live region announces node focus changes for screen readers.

### 9. ~~Mini-map~~ Done
Canvas-based minimap in bottom-right corner shows all nodes as colored dots with a viewport rectangle. Click to pan. Fades out at far zoom (< 1.5) since the whole graph is already visible.
