/**
 * inspect-layout.ts - Compact ASCII layout inspector.
 * Usage: bun run src/inspect-layout.ts
 */

import { generatedNodes } from "./generated-graph";

const W = 90;
const H = 38;
const PAD = 50;

const LANDING_X = 0, LANDING_Y = -170;
const LANDING_R = 110; // estimated label half-diagonal

const xs = generatedNodes.map((n) => n.x);
const ys = generatedNodes.map((n) => n.y);
const minX = Math.min(...xs) - PAD, maxX = Math.max(...xs) + PAD;
const minY = Math.min(...ys) - PAD, maxY = Math.max(...ys) + PAD;
const scaleX = (W - 1) / (maxX - minX);
const scaleY = (H - 1) / (maxY - minY);

function toC(wx: number, wy: number): [number, number] {
  return [Math.round((wx - minX) * scaleX), Math.round((wy - minY) * scaleY)];
}

const bg: string[][] = Array.from({ length: H }, () => Array(W).fill(" "));
const fg: Array<Array<{ ch: string; count: number }>> = Array.from(
  { length: H }, () => Array.from({ length: W }, () => ({ ch: " ", count: 0 })),
);

function bgSet(cx: number, cy: number, ch: string, force = false) {
  if (cx < 0 || cx >= W || cy < 0 || cy >= H) return;
  if (bg[cy]![cx] === " " || force) bg[cy]![cx] = ch;
}
function bgStr(cx: number, cy: number, s: string, force = false) {
  for (let i = 0; i < s.length; i++) bgSet(cx + i, cy, s[i]!, force);
}
function fgDot(cx: number, cy: number, ch: string) {
  if (cx < 0 || cx >= W || cy < 0 || cy >= H) return;
  const cell = fg[cy]![cx]!;
  cell.count++;
  if (cell.count === 1) cell.ch = ch;
}
function drawCircle(wx: number, wy: number, wr: number, ch: string) {
  const steps = Math.max(80, Math.ceil(2 * Math.PI * wr * Math.max(scaleX, scaleY) * 2));
  for (let i = 0; i < steps; i++) {
    const a = (2 * Math.PI * i) / steps;
    const [cx, cy] = toC(wx + wr * Math.cos(a), wy + wr * Math.sin(a));
    bgSet(cx, cy, ch);
  }
}

// Origin
{ const [cx, cy] = toC(0, 0); bgSet(cx, cy, "+"); }

// Region circles
for (const n of generatedNodes.filter((n) => n.tier === "region")) {
  drawCircle(n.x, n.y, n.radius, "░");
  const nChildren = generatedNodes.filter((c) => c.parent === n.id).length;
  const lbl = `${n.label}(${nChildren})`;
  const [cx, cy] = toC(n.x, n.y);
  bgStr(cx - Math.floor(lbl.length / 2), cy, lbl, true);
}

// Landing marker and bounding circle
{ const [cx, cy] = toC(LANDING_X, LANDING_Y); bgStr(cx - 1, cy, "[L]", true); }
drawCircle(LANDING_X, LANDING_Y, LANDING_R, "·");

// All artifact nodes — meta-essays as 'm', essays as '·', code as UPPER
for (const n of generatedNodes.filter((n) => n.tier === "artifact")) {
  const ch = n.cluster === "meta-essays" ? "m"
    : n.id.startsWith("prose/") ? "·"
    : n.label[0]?.toUpperCase() ?? "?";
  const [cx, cy] = toC(n.x, n.y);
  fgDot(cx, cy, ch);
}

// Print
console.log(`\nBounds x[${Math.round(minX)}…${Math.round(maxX)}] y[${Math.round(minY)}…${Math.round(maxY)}]  scale ${(1/scaleX).toFixed(1)}wu/col ${(1/scaleY).toFixed(1)}wu/row\n`);
console.log("┌" + "─".repeat(W) + "┐");
for (let cy = 0; cy < H; cy++) {
  let row = "";
  for (let cx = 0; cx < W; cx++) {
    const cell = fg[cy]![cx]!;
    if (cell.count === 0) row += bg[cy]![cx];
    else if (cell.count === 1) row += cell.ch;
    else row += cell.count <= 9 ? String(cell.count) : "+";
  }
  console.log("│" + row + "│");
}
console.log("└" + "─".repeat(W) + "┘");
console.log("Legend: ░=region  m=meta-essay  ·=essay  ·=landing circle  UPPER=code  digit/+=stacked\n");

// ── Collision report (dot overlaps only, capped) ─────────────────────────────

type N = (typeof generatedNodes)[0] & { tier: string };

const allNodes: Array<N | { id: string; x: number; y: number; radius: number; tier: "synthetic" }> = [
  ...generatedNodes,
  { id: "landing", x: LANDING_X, y: LANDING_Y, radius: LANDING_R, tier: "synthetic" },
];

const dotOverlaps: Array<{ a: typeof allNodes[0]; b: typeof allNodes[0]; overlap: number }> = [];

for (let i = 0; i < allNodes.length; i++) {
  for (let j = i + 1; j < allNodes.length; j++) {
    const a = allNodes[i]!, b = allNodes[j]!;
    if (a.tier === "meta" || b.tier === "meta") continue;
    // Skip same-parent pairs (children of the same region)
    if ("parent" in a && "parent" in b && a.parent && a.parent === b.parent) continue;
    // Skip region vs its own children (children live inside the circle by design)
    if (a.tier === "region" && "parent" in b && b.parent === a.id) continue;
    if (b.tier === "region" && "parent" in a && a.parent === b.id) continue;
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    const gap = dist - a.radius - b.radius;
    if (gap < 0) dotOverlaps.push({ a, b, overlap: -gap });
  }
}

dotOverlaps.sort((a, b) => b.overlap - a.overlap);

if (dotOverlaps.length === 0) {
  console.log("✓ No dot overlaps.\n");
} else {
  const shown = dotOverlaps.slice(0, 12);
  console.log(`Dot overlaps (${dotOverlaps.length} total, showing worst ${shown.length}):`);
  for (const { a, b, overlap } of shown) {
    console.log(`  ▲ ${overlap.toFixed(0).padStart(3)}px  ${a.id}  ↔  ${b.id}`);
  }
  if (dotOverlaps.length > shown.length) console.log(`  … +${dotOverlaps.length - shown.length} more`);
  console.log();
}

// ── Region + cluster summary ──────────────────────────────────────────────────

console.log("Regions:");
for (const r of generatedNodes.filter((n) => n.tier === "region")) {
  const ch = generatedNodes.filter((n) => n.parent === r.id);
  console.log(`  ${r.label.padEnd(8)} center=(${r.x},${r.y})  r=${r.radius}  children=${ch.length}`);
}

const essays = generatedNodes.filter((n) => n.id.startsWith("prose/"));
const metaEssays = generatedNodes.filter((n) => n.cluster === "meta-essays");
const orphans = generatedNodes.filter((n) => n.cluster === "orphans");

console.log(`\nClusters:`);
console.log(`  meta-essays(${metaEssays.length}): ${metaEssays.map((n) => `${n.id.split("/")[1]}@(${n.x},${n.y})`).join("  ")}`);
console.log(`  orphans(${orphans.length}): ${orphans.map((n) => n.label).join(", ")}`);
const ecx = Math.round(essays.reduce((s,n)=>s+n.x,0)/essays.length);
const ecy = Math.round(essays.reduce((s,n)=>s+n.y,0)/essays.length);
let minDist = Infinity;
for (let i=0;i<essays.length;i++) for (let j=i+1;j<essays.length;j++)
  minDist = Math.min(minDist, Math.hypot(essays[i]!.x-essays[j]!.x, essays[i]!.y-essays[j]!.y));
console.log(`  essays(${essays.length}): centroid=(${ecx},${ecy})  min-dist=${Math.round(minDist)}px`);
console.log();
