/**
 * Manages active grouping state and applies position changes to the graph.
 */

import type { Graph, Node } from "./graph";
import { groupings, defaultGrouping, getGrouping, type Grouping } from "./groupings";
import { updatePositions, animateTo, fadeOutRegions, fadeInRegions, nodeEls, type NodePositionWithRegion } from "./dom";
import type { Camera } from "./camera";

let currentGrouping: Grouping = defaultGrouping;
let graphRef: Graph;
let cameraRef: Camera;

/** Store original positions and colors from graph.ts */
const originalData = new Map<string, { x: number; y: number; color: string; parent?: string }>();
/** IDs of region nodes from graph.ts (for containment edge restoration) */
const graphRegionIds = new Set<string>();

export function initGroupingState(graph: Graph, camera: Camera): void {
  graphRef = graph;
  cameraRef = camera;

  // Store original positions, colors, and track region nodes
  for (const node of graph.nodes) {
    originalData.set(node.id, {
      x: node.baseX,
      y: node.baseY,
      color: node.color,
      parent: node.parent,
    });
    if (node.tier === "region") {
      graphRegionIds.add(node.id);
    }
  }
}

export function getCurrentGrouping(): Grouping {
  return currentGrouping;
}

/** Compute node positions with regionIds for a given grouping. */
function computePositionsForGrouping(grouping: Grouping): NodePositionWithRegion[] {
  const positions: NodePositionWithRegion[] = [];

  for (const node of graphRef.nodes) {
    if (node.tier === "region" || node.tier === "meta") continue;

    const override = grouping.positions[node.id];
    const original = originalData.get(node.id);

    // For ecosystem grouping, use the node's parent as regionId
    let regionId = override?.regionId;
    if (!regionId && grouping.id === "ecosystem" && node.parent) {
      regionId = node.parent;
    }

    const x = override?.x ?? original?.x ?? node.x;
    const y = override?.y ?? original?.y ?? node.y;

    positions.push({ nodeId: node.id, x, y, regionId });
  }

  return positions;
}

export function getGroupings(): Grouping[] {
  return groupings;
}

export function setGrouping(groupingId: string): void {
  const grouping = getGrouping(groupingId);
  if (!grouping || grouping.id === currentGrouping.id) return;

  const fadeDuration = 300;

  // Fade out current regions and their containment edges
  fadeOutRegions(fadeDuration);

  // Compute positions for new containment edges
  const positions = computePositionsForGrouping(grouping);

  // Fade in new regions (with slight delay for crossfade overlap)
  setTimeout(() => {
    fadeInRegions(grouping.regions, positions, fadeDuration);
  }, fadeDuration * 0.3);

  currentGrouping = grouping;
  applyGroupingPositions();

  // Update URL
  const params = new URLSearchParams(location.search);
  if (groupingId === defaultGrouping.id) {
    params.delete("grouping");
  } else {
    params.set("grouping", groupingId);
  }
  const qs = params.toString();
  history.replaceState(history.state, "", qs ? `?${qs}` : location.pathname);
}

function applyGroupingPositions(animate = true): void {
  // Compute target positions (only update x/y, NOT baseX/baseY)
  // baseX/baseY stays as original position from buildWorld
  // translate CSS will handle the offset
  const targets = new Map<string, { x: number; y: number }>();

  for (const node of graphRef.nodes) {
    if (node.tier === "region") continue;

    const override = currentGrouping.positions[node.id];
    const original = originalData.get(node.id);

    if (override) {
      targets.set(node.id, { x: override.x, y: override.y });
    } else if (original) {
      targets.set(node.id, { x: original.x, y: original.y });
    }
  }

  // Apply colors (CSS transition handles animation)
  for (const node of graphRef.nodes) {
    if (node.tier === "region") continue;
    const el = nodeEls.get(node.id);
    if (!el) continue;

    const override = currentGrouping.positions[node.id];
    const original = originalData.get(node.id);
    const color = override?.color ?? original?.color ?? node.color;
    el.style.setProperty("--color", color);
  }

  if (!animate) {
    // Snap immediately
    for (const node of graphRef.nodes) {
      const target = targets.get(node.id);
      if (target) {
        node.x = target.x;
        node.y = target.y;
      }
    }
    updatePositions(graphRef);
    return;
  }

  // Animate to target positions
  const duration = 400;
  const start = performance.now();
  const startPositions = new Map<string, { x: number; y: number }>();

  for (const node of graphRef.nodes) {
    if (targets.has(node.id)) {
      startPositions.set(node.id, { x: node.x, y: node.y });
    }
  }

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const ease = t * (2 - t); // ease-out

    for (const node of graphRef.nodes) {
      const target = targets.get(node.id);
      const startPos = startPositions.get(node.id);
      if (target && startPos) {
        node.x = startPos.x + (target.x - startPos.x) * ease;
        node.y = startPos.y + (target.y - startPos.y) * ease;
      }
    }

    updatePositions(graphRef);

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/** Restore grouping from URL on page load */
export function restoreGroupingFromUrl(): void {
  const groupingId = new URLSearchParams(location.search).get("grouping");
  if (groupingId) {
    const grouping = getGrouping(groupingId);
    if (grouping && grouping.id !== defaultGrouping.id) {
      currentGrouping = grouping;
      const positions = computePositionsForGrouping(grouping);
      // Swap regions immediately (no animation on page load)
      fadeOutRegions(0);
      fadeInRegions(grouping.regions, positions, 0);
      applyGroupingPositions(false); // Don't animate on page load
    }
  }
}

export function buildGroupingUI(container: HTMLElement): void {
  const wrapper = document.createElement("div");
  wrapper.className = "grouping-selector";

  for (const grouping of groupings) {
    const btn = document.createElement("button");
    btn.className = "grouping-btn";
    btn.textContent = grouping.label;
    btn.dataset.grouping = grouping.id;

    if (grouping.id === currentGrouping.id) {
      btn.dataset.active = "";
    }

    btn.addEventListener("click", () => {
      // Update active state
      for (const b of wrapper.querySelectorAll<HTMLElement>(".grouping-btn")) {
        delete b.dataset.active;
      }
      btn.dataset.active = "";

      setGrouping(grouping.id);
    });

    wrapper.appendChild(btn);
  }

  container.appendChild(wrapper);
}
