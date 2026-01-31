import type { Camera } from "./camera";
import { worldToScreen, currentTier } from "./camera";
import type { Graph, Node } from "./graph";

/** Render the graph to canvas given current camera state. */
export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  graph: Graph,
  camera: Camera,
  hovered: Node | null,
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const tier = currentTier(camera);

  // Build focus set — hovered node + its neighbors
  const focused = buildFocusSet(graph, hovered);

  // Draw edges
  for (const edge of graph.edges) {
    const from = graph.nodes.find((n) => n.id === edge.from);
    const to = graph.nodes.find((n) => n.id === edge.to);
    if (!from || !to) continue;

    // Skip ecosystem→project edges at far zoom
    if (tier === "far" && (from.tier === "ecosystem" || to.tier === "ecosystem")) {
      if (from.tier !== to.tier) continue;
    }

    const edgeFocused = !hovered || focused.has(from.id) && focused.has(to.id);
    const baseAlpha = tier === "far" ? 0.08 : tier === "mid" ? 0.15 : 0.25;
    ctx.globalAlpha = edgeFocused ? baseAlpha : baseAlpha * 0.2;

    const [x1, y1] = worldToScreen(camera, from.x, from.y, canvas);
    const [x2, y2] = worldToScreen(camera, to.x, to.y, canvas);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = edgeFocused && hovered ? "#888" : "#555";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Edge labels at near zoom
    if (tier === "near" && edge.label && edgeFocused) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      ctx.globalAlpha = 0.4;
      ctx.font = "10px monospace";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.fillText(edge.label, mx, my - 4);
    }
  }
  ctx.globalAlpha = 1;

  // Draw nodes
  for (const node of graph.nodes) {
    const visible = isVisible(node, tier);
    if (!visible) continue;

    const [sx, sy] = worldToScreen(camera, node.x, node.y, canvas);
    const sr = node.radius * camera.zoom;

    // Skip if offscreen
    if (sx + sr < 0 || sx - sr > canvas.width) continue;
    if (sy + sr < 0 || sy - sr > canvas.height) continue;

    const isHovered = hovered?.id === node.id;
    const isFocused = !hovered || focused.has(node.id);
    const dimAlpha = isFocused ? 1 : 0.15;

    ctx.globalAlpha = dimAlpha;

    // Ecosystem regions at far zoom: soft glow
    if (node.tier === "ecosystem" && tier === "far") {
      const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      gradient.addColorStop(0, node.color + "40");
      gradient.addColorStop(1, node.color + "00");
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(sr * (node.tier === "ecosystem" ? 0.15 : 1), 3), 0, Math.PI * 2);
    ctx.fillStyle = isHovered ? lighten(node.color) : node.color;
    ctx.fill();

    if (isHovered) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Labels
    if (tier === "far" && node.tier === "ecosystem") {
      ctx.font = `bold ${Math.max(14, sr * 0.18)}px monospace`;
      ctx.fillStyle = "#ddd";
      ctx.textAlign = "center";
      ctx.fillText(node.label, sx, sy + sr * 0.06);
    } else if (tier !== "far" || node.tier === "ecosystem") {
      const fontSize = Math.max(10, Math.min(14, sr * 0.5));
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = isHovered ? "#fff" : "#ccc";
      ctx.textAlign = "center";
      ctx.fillText(node.label, sx, sy + sr + fontSize + 2);
    }

    // Description at near zoom
    if (tier === "near" && (node.tier === "project" || isHovered) && isFocused) {
      const fontSize = Math.max(9, Math.min(11, sr * 0.3));
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.fillText(node.description, sx, sy + sr + 16 + fontSize);
    }
  }
  ctx.globalAlpha = 1;
}

/** Build set of node IDs that should be fully visible when a node is focused. */
function buildFocusSet(graph: Graph, hovered: Node | null): Set<string> {
  const set = new Set<string>();
  if (!hovered) return set;
  set.add(hovered.id);
  // Add parent ecosystem
  if (hovered.parent) set.add(hovered.parent);
  // Add children if hovering an ecosystem
  for (const node of graph.nodes) {
    if (node.parent === hovered.id) set.add(node.id);
  }
  // Add edge neighbors
  for (const edge of graph.edges) {
    if (edge.from === hovered.id) set.add(edge.to);
    if (edge.to === hovered.id) set.add(edge.from);
  }
  return set;
}

function isVisible(node: Node, tier: "far" | "mid" | "near"): boolean {
  if (node.tier === "ecosystem") return true;
  if (node.tier === "project") return tier !== "far";
  return tier === "near";
}

function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 0.3;
  return `rgb(${Math.round(r + (255 - r) * f)}, ${Math.round(g + (255 - g) * f)}, ${Math.round(b + (255 - b) * f)})`;
}
