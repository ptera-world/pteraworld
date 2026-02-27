/**
 * inspect-layout.ts - ASCII scatter plot of the node layout with collision detection.
 * Reads from generated-graph.ts (run `bun run gen-edges` first if stale).
 *
 * Usage: bun run src/inspect-layout.ts
 */

import { generatedNodes } from "./generated-graph";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const W = 132; // canvas columns
const H = 52;  // canvas rows
const PAD = 60; // world-unit padding around bounds

const MIN_GAP = 15; // comfortable minimum gap between node edges

// Label size estimate: ~7px per char, centered, so half-width per side
const LABEL_PX_PER_CHAR = 7;

// Default camera: zoom=1.5, centered at (0,0)
const DEFAULT_ZOOM = 1.5;

// Common viewport sizes to show on plot [label, w, h]
const VIEWPORTS: [string, number, number][] = [
  ["mobile", 390, 844],
  ["tablet", 768, 1024],
  ["desktop", 1440, 900],
];

// Landing element: centered at (0, -170), estimated visual bounding box
const LANDING_X = 0;
const LANDING_Y = -170;
const LANDING_W = 220; // estimated px width
const LANDING_H = 120; // estimated px height

// ─────────────────────────────────────────────────────────────────────────────
// Synthetic nodes: landing + viewport markers (collision only, not graph nodes)
// ─────────────────────────────────────────────────────────────────────────────

type SyntheticNode = {
  id: string;
  x: number;
  y: number;
  radius: number; // half-diagonal of bounding box
  tier: "synthetic";
};

const syntheticNodes: SyntheticNode[] = [
  {
    id: "landing",
    x: LANDING_X,
    y: LANDING_Y,
    radius: Math.hypot(LANDING_W / 2, LANDING_H / 2),
    tier: "synthetic",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// World → canvas mapping
// ─────────────────────────────────────────────────────────────────────────────

const xs = generatedNodes.map((n) => n.x);
const ys = generatedNodes.map((n) => n.y);
const minX = Math.min(...xs) - PAD;
const maxX = Math.max(...xs) + PAD;
const minY = Math.min(...ys) - PAD;
const maxY = Math.max(...ys) + PAD;
const wW = maxX - minX;
const wH = maxY - minY;

const scaleX = (W - 1) / wW;
const scaleY = (H - 1) / wH;

function toCanvas(wx: number, wy: number): [cx: number, cy: number] {
  return [Math.round((wx - minX) * scaleX), Math.round((wy - minY) * scaleY)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Drawing primitives
// ─────────────────────────────────────────────────────────────────────────────

// Two layers: background (circles, axes) and foreground (nodes — tracks count per cell)
const bg: string[][] = Array.from({ length: H }, () => Array(W).fill(" "));
const nodeCounts: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
// Which single char to show when count=1
const nodeChars: string[][] = Array.from({ length: H }, () => Array(W).fill(" "));

function bgPlot(cx: number, cy: number, ch: string, force = false) {
  if (cx < 0 || cx >= W || cy < 0 || cy >= H) return;
  if (bg[cy]![cx] === " " || force) bg[cy]![cx] = ch;
}

function bgStr(cx: number, cy: number, str: string, force = false) {
  for (let i = 0; i < str.length; i++) bgPlot(cx + i, cy, str[i]!, force);
}

function nodePlot(cx: number, cy: number, ch: string) {
  if (cx < 0 || cx >= W || cy < 0 || cy >= H) return;
  nodeCounts[cy]![cx]! += 1;
  if (nodeCounts[cy]![cx] === 1) nodeChars[cy]![cx] = ch;
}

// Draw a world-space circle as an ellipse on canvas (accounts for non-uniform scale)
function drawCircle(wx: number, wy: number, wr: number, ch: string) {
  const canvasRx = wr * scaleX;
  const canvasRy = wr * scaleY;
  const steps = Math.max(120, Math.ceil(2 * Math.PI * Math.max(canvasRx, canvasRy) * 2));
  for (let i = 0; i < steps; i++) {
    const angle = (2 * Math.PI * i) / steps;
    const [cx, cy] = toCanvas(wx + wr * Math.cos(angle), wy + wr * Math.sin(angle));
    bgPlot(cx, cy, ch);
  }
}

// Draw an axis-aligned rectangle outline on bg layer
function drawRect(wx1: number, wy1: number, wx2: number, wy2: number, ch: string) {
  const [cx1, cy1] = toCanvas(wx1, wy1);
  const [cx2, cy2] = toCanvas(wx2, wy2);
  for (let cx = Math.min(cx1, cx2); cx <= Math.max(cx1, cx2); cx++) {
    bgPlot(cx, cy1, ch);
    bgPlot(cx, cy2, ch);
  }
  for (let cy = Math.min(cy1, cy2); cy <= Math.max(cy1, cy2); cy++) {
    bgPlot(cx1, cy, ch);
    bgPlot(cx2, cy, ch);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Render
// ─────────────────────────────────────────────────────────────────────────────

// Origin marker
{
  const [zx, zy] = toCanvas(0, 0);
  bgPlot(zx, zy, "+");
}

// Region circles and labels
for (const n of generatedNodes.filter((n) => n.tier === "region")) {
  drawCircle(n.x, n.y, n.radius, "░");
  const children = generatedNodes.filter((c) => c.parent === n.id);
  const label = `${n.label}(${children.length})`;
  const [cx, cy] = toCanvas(n.x, n.y);
  bgStr(cx - Math.floor(label.length / 2), cy, label, true);
}

// Essay cluster — single marker at center
{
  const essays = generatedNodes.filter((n) => n.tags.includes("essay"));
  if (essays.length > 0) {
    // Compute actual centroid
    const cx0 = essays.reduce((s, n) => s + n.x, 0) / essays.length;
    const cy0 = essays.reduce((s, n) => s + n.y, 0) / essays.length;
    const label = `essays(${essays.length})`;
    const [cx, cy] = toCanvas(cx0, cy0);
    bgStr(cx - Math.floor(label.length / 2), cy, label, true);
  }
}

// Orphan projects (no parent, not essay) — shown individually, few enough
const orphans = generatedNodes.filter((n) => n.tier === "artifact" && !n.parent && !n.tags.includes("essay"));
for (const n of orphans) {
  const [cx, cy] = toCanvas(n.x, n.y);
  nodePlot(cx, cy, n.label[0]?.toLowerCase() ?? "?");
}

// Meta / landing markers
for (const n of generatedNodes.filter((n) => n.tier === "meta")) {
  const [cx, cy] = toCanvas(n.x, n.y);
  bgPlot(cx, cy, "★", true);
}
{
  const [cx, cy] = toCanvas(LANDING_X, LANDING_Y);
  bgStr(cx - 1, cy, "[L]", true);
}

// ─────────────────────────────────────────────────────────────────────────────
// Composite and print canvas
// ─────────────────────────────────────────────────────────────────────────────

console.log(`\nWorld bounds: x[${minX.toFixed(0)}…${maxX.toFixed(0)}]  y[${minY.toFixed(0)}…${maxY.toFixed(0)}]`);
console.log(`Scale: ${(1 / scaleX).toFixed(1)} wu/col  ${(1 / scaleY).toFixed(1)} wu/row\n`);
console.log("┌" + "─".repeat(W) + "┐");
for (let cy = 0; cy < H; cy++) {
  let row = "";
  for (let cx = 0; cx < W; cx++) {
    const count = nodeCounts[cy]![cx]!;
    if (count === 0) {
      row += bg[cy]![cx];
    } else if (count === 1) {
      row += nodeChars[cy]![cx];
    } else {
      // Multiple nodes: show count (cap at 9, then +)
      row += count <= 9 ? String(count) : "+";
    }
  }
  console.log("│" + row + "│");
}
console.log("└" + "─".repeat(W) + "┘");
console.log("\nLegend: ░ region boundary  letter/★ = 1 node  digit/+ = N stacked nodes");
console.log("        ╌ viewport outline  ▪ landing element  · axis  + origin");

// ─────────────────────────────────────────────────────────────────────────────
// Collision detection
// ─────────────────────────────────────────────────────────────────────────────

type AnyNode = (typeof generatedNodes)[0] | SyntheticNode;

function dotRadius(n: AnyNode): number {
  if (n.tier === "region") return n.radius;
  if (n.tier === "artifact") return n.radius;
  if (n.tier === "synthetic") return n.radius;
  return 0; // meta
}

function labelRadius(n: AnyNode): number {
  if (n.tier === "artifact") return n.radius + Math.ceil(((n as (typeof generatedNodes)[0]).label.length * LABEL_PX_PER_CHAR) / 2);
  return dotRadius(n);
}

type CollisionPair = {
  a: AnyNode;
  b: AnyNode;
  dist: number;
  gap: number;
  kind: "region" | "dot" | "label";
};

const allNodes: AnyNode[] = [...generatedNodes, ...syntheticNodes];
const collisions: CollisionPair[] = [];

for (let i = 0; i < allNodes.length; i++) {
  for (let j = i + 1; j < allNodes.length; j++) {
    const a = allNodes[i]!;
    const b = allNodes[j]!;
    if (a.tier === "meta" || b.tier === "meta") continue;

    const dist = Math.hypot(a.x - b.x, a.y - b.y);

    // Region vs region
    if (a.tier === "region" && b.tier === "region") {
      const gap = dist - dotRadius(a) - dotRadius(b);
      if (gap < MIN_GAP) collisions.push({ a, b, dist, gap, kind: "region" });
      continue;
    }

    // Physical dot overlap (all cross-tier and same-group pairs)
    const dotGap = dist - dotRadius(a) - dotRadius(b);
    if (dotGap < 0) {
      collisions.push({ a, b, dist, gap: dotGap, kind: "dot" });
      continue;
    }

    // Label clearance: only artifact vs artifact, non-essay-vs-essay
    const aIsEssay = a.tier === "artifact" && (a as (typeof generatedNodes)[0]).tags.includes("essay");
    const bIsEssay = b.tier === "artifact" && (b as (typeof generatedNodes)[0]).tags.includes("essay");
    if (a.tier === "artifact" && b.tier === "artifact" && !(aIsEssay && bIsEssay)) {
      const labelGap = dist - labelRadius(a) - labelRadius(b);
      if (labelGap < MIN_GAP) collisions.push({ a, b, dist, gap: labelGap, kind: "label" });
    }
  }
}

collisions.sort((x, y) => x.gap - y.gap);

console.log("\n── Collision Report " + "─".repeat(60));

const regionCols = collisions.filter((c) => c.kind === "region");
const dotCols = collisions.filter((c) => c.kind === "dot");
const labelCols = collisions.filter((c) => c.kind === "label");

if (collisions.length === 0) {
  console.log("  ✓ No collisions or near-misses.\n");
} else {
  function fmtNode(n: AnyNode) {
    return `${n.id} (r=${dotRadius(n)})`;
  }

  if (regionCols.length > 0) {
    console.log(`\n  REGION OVERLAPS (${regionCols.length}) — territory circles intersect:`);
    for (const c of regionCols) {
      const tag = c.gap < 0 ? `▲ ${(-c.gap).toFixed(0).padStart(3)}px overlap` : `· ${c.gap.toFixed(0).padStart(3)}px gap   `;
      console.log(`    ${tag}  ${fmtNode(c.a)}  ↔  ${fmtNode(c.b)}  dist=${c.dist.toFixed(0)}`);
    }
  }

  if (dotCols.length > 0) {
    // Separate out essay-cluster internal overlaps to summarize them
    const essayInternal = dotCols.filter(
      (c) =>
        c.a.tier === "artifact" &&
        c.b.tier === "artifact" &&
        (c.a as (typeof generatedNodes)[0]).tags.includes("essay") &&
        (c.b as (typeof generatedNodes)[0]).tags.includes("essay"),
    );
    const sameParentInternal = dotCols.filter((c) => {
      if (c.a.tier !== "artifact" || c.b.tier !== "artifact") return false;
      const pa = (c.a as (typeof generatedNodes)[0]).parent;
      const pb = (c.b as (typeof generatedNodes)[0]).parent;
      return pa && pa === pb;
    });
    const crossGroup = dotCols.filter((c) => !essayInternal.includes(c) && !sameParentInternal.includes(c));

    if (crossGroup.length > 0) {
      console.log(`\n  DOT OVERLAPS cross-group (${crossGroup.length}):`);
      for (const c of crossGroup) {
        console.log(`    ▲ ${(-c.gap).toFixed(0).padStart(3)}px  ${fmtNode(c.a)}  ↔  ${fmtNode(c.b)}  dist=${c.dist.toFixed(0)}`);
      }
    }
    if (sameParentInternal.length > 0) {
      const worst = sameParentInternal[0]!;
      const parents = new Set(sameParentInternal.map((c) => (c.a as (typeof generatedNodes)[0]).parent));
      console.log(`\n  DOT OVERLAPS same-parent (${sameParentInternal.length} pairs across ${parents.size} regions, worst: ${(-worst.gap).toFixed(0)}px ${worst.a.id} ↔ ${worst.b.id})`);
    }
    if (essayInternal.length > 0) {
      const worst = essayInternal[0]!;
      console.log(`\n  DOT OVERLAPS essay cluster (${essayInternal.length} pairs, worst: ${(-worst.gap).toFixed(0)}px overlap between ${worst.a.id} ↔ ${worst.b.id})`);
    }
  }

  if (labelCols.length > 0) {
    console.log(`\n  LABEL NEAR-MISSES cross-group (${labelCols.length}, gap < ${MIN_GAP}px):`);
    for (const c of labelCols) {
      const tag = c.gap < 0 ? `overlap ${(-c.gap).toFixed(0).padStart(3)}px` : `gap     ${c.gap.toFixed(0).padStart(3)}px`;
      console.log(`    · ${tag}  ${c.a.id} (lr=${labelRadius(c.a)})  ↔  ${c.b.id} (lr=${labelRadius(c.b)})  dist=${c.dist.toFixed(0)}`);
    }
  }
  console.log();
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport summary: which nodes are visible at default camera per screen size
// ─────────────────────────────────────────────────────────────────────────────

console.log("── Viewport Summary (zoom=1.5, camera at origin) " + "─".repeat(31));
for (const [label, vw, vh] of VIEWPORTS) {
  const halfW = (vw / 2) / DEFAULT_ZOOM;
  const halfH = (vh / 2) / DEFAULT_ZOOM;
  const visible = generatedNodes.filter((n) => {
    // Node is "visible" if its center is within the viewport (ignoring radius for simplicity)
    return n.x >= -halfW && n.x <= halfW && n.y >= -halfH && n.y <= halfH;
  });
  const regions = visible.filter((n) => n.tier === "region").map((n) => n.label);
  const projects = visible.filter((n) => n.tier === "artifact" && !n.tags.includes("essay")).map((n) => n.label);
  const essays = visible.filter((n) => n.tags.includes("essay")).length;
  console.log(`  ${label.padEnd(10)} ${vw}×${vh}  world ±${halfW.toFixed(0)}×${halfH.toFixed(0)}  visible: ${regions.length} regions [${regions.join(", ")}]  ${projects.length} projects  ${essays} essays`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Region summary
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n── Region Summary " + "─".repeat(62));
for (const r of generatedNodes.filter((n) => n.tier === "region")) {
  const children = generatedNodes.filter((n) => n.parent === r.id);
  let childInfo = `${children.length} children`;
  if (children.length > 0) {
    const cxs = children.map((c) => c.x);
    const cys = children.map((c) => c.y);
    childInfo += `  bbox x[${Math.min(...cxs)}…${Math.max(...cxs)}] y[${Math.min(...cys)}…${Math.max(...cys)}]`;
  }
  console.log(`  ${r.label.padEnd(14)} center=(${String(r.x).padStart(5)},${String(r.y).padStart(5)})  r=${String(r.radius).padStart(3)}  ${childInfo}`);
}
const summaryOrphans = generatedNodes.filter((n) => n.tier === "artifact" && !n.parent && !n.tags.includes("essay"));
const summaryEssays = generatedNodes.filter((n) => n.tags.includes("essay"));
// Compute actual essay min spacing from generated positions
let essayMinDist = Infinity;
for (let i = 0; i < summaryEssays.length; i++)
  for (let j = i + 1; j < summaryEssays.length; j++)
    essayMinDist = Math.min(essayMinDist, Math.hypot(summaryEssays[i]!.x - summaryEssays[j]!.x, summaryEssays[i]!.y - summaryEssays[j]!.y));
const essayMinGap = summaryEssays.length > 1 ? Math.round(essayMinDist - 48) : 0;
const cxE = Math.round(summaryEssays.reduce((s, n) => s + n.x, 0) / summaryEssays.length);
const cyE = Math.round(summaryEssays.reduce((s, n) => s + n.y, 0) / summaryEssays.length);
console.log(`  orphans(${summaryOrphans.length})       ${summaryOrphans.map((n) => n.label).join(", ")}`);
console.log(`  essays(${summaryEssays.length})        centroid=(${cxE},${cyE}), min spacing≈${Math.round(essayMinDist)}px, dot r=24  ${essayMinGap >= 0 ? `✓ gap ${essayMinGap}px` : `▲ overlap ${-essayMinGap}px`}`);
console.log();
