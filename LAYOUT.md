# Layout Design

## Why a graph?

A graph makes structure visible and navigable. What it gives over a linear list:

- You can enter from anywhere and follow your own path
- Connections between things are first-class, not footnotes
- The spatial arrangement gives you a sense of the whole before you dive in

**The layout itself is the argument about how things relate.** Where things are placed, how close they are, what's adjacent — all of it communicates meaning. Nodes shouldn't just be placed; they should be placed *deliberately*.

## What should be visible at default zoom?

Not everything — that's semantic inundation. But enough **threads to pull on**. The goal is that someone landing on the page sees a landscape they can orient in, with enough entry points to start exploring.

- Prominent nodes (regions, key anchors) are visible with full titles
- Dense clusters (e.g. essays) collapse to dots — present and clickable, not readable
- The edge network creates paths; you don't need every node exposed to make the structure navigable

**Zoom is not a solution to overcrowding.** Zooming out until everything fits means seeing nothing. Zooming in to find things means losing the landscape. The default view is a design decision.

## Zoom tiers and label visibility

- **Default zoom (far):** landscape view — regions, key anchors, cluster hints
- **Mid zoom:** dots surface short labels; focused nodes show edge-relationship names for connected dots
- **Zoomed in (near):** full titles, full detail

Nodes visible at default zoom earn their full title. Dots get context-relative names (edge label or relationship) when a neighboring node is focused. Expanded or permanently visible nodes always show their full title.

## The scaling problem

The current ring layout doesn't scale. A ring of N nodes has radius proportional to N — at 46 essays, the ring either:
- Overlaps neighboring clusters, or
- Grows so large it dominates the layout

This is a fundamental mismatch between a 1D structure (ring) and a 2D space. Content will keep growing.

## Hybrid placement

**Hand-placed anchors** for things that matter structurally: ecosystem regions, key nodes that define the shape of the graph. These positions carry meaning.

**Algorithmic layout** for everything else: handles density, collision avoidance, and responds to content growth without breaking the overall structure. Force-directed expansion works well for surfacing linked nodes on interaction.

The algorithm must be **globally space-aware** — it can't compute cluster radii independently and then place them. It needs to know the total space budget before placing anything.

## Hybrid placement (current vs target)

Current state has some hardcoded values that should eventually be derived from content:
- Essay cluster center position (`essayCenter`)
- Orphan cluster positions
- Region hue assignments
- Which essays are "meta" essays (site-about-itself) vs idea essays

These are fine as stepping stones. The direction is: hand-placed anchors for structural meaning, everything else algorithmic and content-driven.

## Specific issues (current state)

- Essay ring (r=120, 46 nodes, dot r=24): nodes overlap each other by ~32px
- Growing ring to non-overlapping size (r=422) pushes essays into rhi territory
- `project/moonlet` and `project/claude-code-hub` sit inside the essay cluster area
- `ecosystem/exo` (r=140) swallows its own children (aspect, hologram) — children placed on ring of r=144, inside territory boundary
- Landing element at (0, -170) overlaps ~10 nearby nodes
- No screen size fits everything at default zoom — this is expected and acceptable, but the layout should be intentional about what's centered/prominent
