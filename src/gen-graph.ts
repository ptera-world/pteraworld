/**
 * Unified build script: reads frontmatter + edges from public/content/*.md
 * and generates src/generated-graph.ts with node definitions and edges.
 *
 * Replaces gen-edges.ts. Run with: bun run src/gen-graph.ts
 */
import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join } from "path";
import { parseFrontmatter, stripFrontmatter, inferTier, inferTags } from "./frontmatter";

const contentDir = join(import.meta.dir, "../public/content");
const outFile = join(import.meta.dir, "generated-graph.ts");

// ---------------------------------------------------------------------------
// 1. Walk content directory
// ---------------------------------------------------------------------------

async function findMarkdownFiles(dir: string, prefix = ""): Promise<{ id: string; path: string; category: string }[]> {
  const entries = await readdir(dir);
  const results: { id: string; path: string; category: string }[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      const subResults = await findMarkdownFiles(fullPath, prefix ? `${prefix}/${entry}` : entry);
      results.push(...subResults);
    } else if (entry.endsWith(".md")) {
      const basename = entry.replace(/\.md$/, "");
      const id = prefix ? `${prefix}/${basename}` : basename;
      const category = prefix.split("/")[0] || "";
      results.push({ id, path: fullPath, category });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 2. Parse all files
// ---------------------------------------------------------------------------

interface ParsedNode {
  id: string;
  label: string;
  description: string;
  url?: string;
  tier: "region" | "project" | "detail" | "meta";
  parent?: string;
  status?: "production" | "fleshed-out" | "early" | "planned";
  tags: string[];
  radius: number;
  color: string;
  // Set later by layout
  x: number;
  y: number;
}

// Content-only directories: files here don't become nodes unless they have tier: in frontmatter
const CONTENT_ONLY_DIRS = new Set(["domain", "technology", "status"]);

const files = await findMarkdownFiles(contentDir);
const nodes: ParsedNode[] = [];
const nodeIds = new Set<string>();

for (const { id, path, category } of files) {
  const text = await readFile(path, "utf-8");
  const fm = parseFrontmatter(text);
  if (!fm) {
    // Content-only dirs without frontmatter are skipped
    if (CONTENT_ONLY_DIRS.has(category)) continue;
    // Other files without frontmatter are also skipped (they need frontmatter to be nodes)
    continue;
  }

  // Skip content-only dirs unless they explicitly set tier
  if (CONTENT_ONLY_DIRS.has(category) && !fm.tier) continue;

  const tier = fm.tier ?? inferTier(category);
  if (!tier) continue; // Can't determine tier — skip

  const autoTags = inferTags(category, tier);
  const userTags = fm.tags ?? [];
  const allTags = [...new Set([...autoTags, ...userTags])];

  const radius = fm.radius ?? radiusFromStatus(fm.status);

  nodes.push({
    id,
    label: fm.label,
    description: fm.description,
    url: fm.url,
    tier,
    parent: fm.parent,
    status: fm.status,
    tags: allTags,
    radius,
    color: fm.color ?? "", // Filled in by layout
    x: 0,
    y: 0,
  });
  nodeIds.add(id);
}

function radiusFromStatus(status?: string): number {
  switch (status) {
    case "production": return 30;
    case "fleshed-out": return 26;
    case "early": return 22;
    case "planned": return 20;
    default: return 24; // essays, meta, etc.
  }
}

// ---------------------------------------------------------------------------
// 3. Compute layout: positions and colors
// ---------------------------------------------------------------------------

/** Place nodes evenly on a circle, starting from the top and going clockwise. */
function ringLayout(cx: number, cy: number, r: number, items: ParsedNode[]): void {
  for (let i = 0; i < items.length; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / items.length;
    items[i]!.x = Math.round(cx + r * Math.cos(angle));
    items[i]!.y = Math.round(cy + r * Math.sin(angle));
  }
}

// Separate nodes by type
const regions = nodes.filter((n) => n.tier === "region");
const metaNodes = nodes.filter((n) => n.tier === "meta");
const projectNodes = nodes.filter((n) => n.tier === "project");

// --- Region layout: ring around origin ---
const regionHues: Map<string, number> = new Map();
{
  // Assign hues evenly on oklch wheel
  const baseHues = [155, 320]; // rhi=green, exo=pink — extend as regions grow
  regions.forEach((region, i) => {
    const hue = baseHues[i] ?? (360 * i) / regions.length;
    regionHues.set(region.id, hue);
    if (!region.color) {
      region.color = `oklch(0.7 0.12 ${hue})`;
    }
  });

  // Size regions by child count (before positioning, so radii inform spacing)
  for (const region of regions) {
    const children = projectNodes.filter((n) => n.parent === region.id);
    if (region.radius === 24) {
      // Default — compute from child count
      region.radius = Math.max(140, 100 + children.length * 6);
    }
  }

  // Position regions on a ring around origin
  if (regions.length === 1) {
    regions[0]!.x = 0;
    regions[0]!.y = 0;
  } else {
    // Ring radius: enough to keep regions separated
    const maxRadius = Math.max(...regions.map((r) => r.radius));
    const ringR = maxRadius + 100;
    for (let i = 0; i < regions.length; i++) {
      // Start from the left, spread evenly
      const angle = Math.PI + (2 * Math.PI * i) / regions.length;
      regions[i]!.x = Math.round(ringR * Math.cos(angle));
      regions[i]!.y = Math.round(ringR * Math.sin(angle));
    }
  }
}

// --- Children of regions: ring around parent ---
const parentGroups = new Map<string, ParsedNode[]>();
for (const node of projectNodes) {
  if (node.parent) {
    const group = parentGroups.get(node.parent) ?? [];
    group.push(node);
    parentGroups.set(node.parent, group);
  }
}

for (const [parentId, children] of parentGroups) {
  const parent = regions.find((r) => r.id === parentId);
  if (!parent) continue;

  const hue = regionHues.get(parentId) ?? 0;
  // Ring radius based on parent visual radius
  const ringR = Math.max(80, parent.radius + children.length * 2);
  ringLayout(parent.x, parent.y, ringR, children);

  for (const child of children) {
    if (!child.color) {
      child.color = `oklch(0.78 0.09 ${hue})`;
    }
  }
}

// --- Orphan projects (no parent, not essay): cluster ---
const orphans = projectNodes.filter((n) => !n.parent && !n.tags.includes("essay"));
const essays = projectNodes.filter((n) => n.tags.includes("essay"));

// Orphans: spread above and below
{
  const orphanColor = "oklch(0.78 0.09 85)";
  // Place orphans in a ring at a neutral position
  if (orphans.length > 0) {
    // Split into top and bottom clusters for visual balance
    const topOrphans = orphans.slice(0, Math.ceil(orphans.length / 2));
    const bottomOrphans = orphans.slice(Math.ceil(orphans.length / 2));

    if (topOrphans.length > 0) {
      ringLayout(0, -280, 60 + topOrphans.length * 15, topOrphans);
    }
    if (bottomOrphans.length > 0) {
      ringLayout(80, 230, 60 + bottomOrphans.length * 15, bottomOrphans);
    }

    for (const o of orphans) {
      if (!o.color) o.color = orphanColor;
    }
  }
}

// --- Essays: ring cluster ---
{
  const essayHue = 45;
  const essayColor = `oklch(0.78 0.09 ${essayHue})`;
  const essayCenter = { x: 80, y: 40 };

  // Find "the-great-deceit" — it goes in the center
  const centerEssay = essays.find((e) => e.id === "prose/the-great-deceit");
  const ringEssays = essays.filter((e) => e.id !== "prose/the-great-deceit");

  if (ringEssays.length > 0) {
    ringLayout(essayCenter.x, essayCenter.y, 120, ringEssays);
  }
  if (centerEssay) {
    centerEssay.x = essayCenter.x;
    centerEssay.y = essayCenter.y;
  }

  for (const e of essays) {
    if (!e.color) e.color = essayColor;
  }
}

// --- Meta nodes: fixed position ---
for (const meta of metaNodes) {
  meta.x = 0;
  meta.y = -170;
  meta.radius = 0;
  if (!meta.color) meta.color = "#fff";
}

// ---------------------------------------------------------------------------
// 4. Extract edges from ## Related projects / ## See also
// ---------------------------------------------------------------------------

interface EdgeDef {
  from: string;
  to: string;
  strength: number;
}

const seen = new Set<string>();
const edges: EdgeDef[] = [];

for (const { id, path } of files) {
  const text = await readFile(path, "utf-8");
  const body = stripFrontmatter(text);

  const match = body.match(/## (?:Related projects|See also)\n([\s\S]*?)(?=\n## |\n$|$)/);
  if (!match) continue;

  const section = match[1]!;
  const linkPattern = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkPattern.exec(section)) !== null) {
    const target = linkMatch[2]!;
    const key = [id, target].sort().join("|");
    if (!seen.has(key)) {
      seen.add(key);
      const sorted = [id, target].sort();
      edges.push({ from: sorted[0]!, to: sorted[1]!, strength: 0.5 });
    }
  }
}

edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));

// ---------------------------------------------------------------------------
// 5. Write output
// ---------------------------------------------------------------------------

// Sort nodes by id for stable output
nodes.sort((a, b) => a.id.localeCompare(b.id));

function quote(s: string): string {
  if (s.includes('"') || s.includes("\n") || s.includes("\\")) {
    return JSON.stringify(s);
  }
  return `"${s}"`;
}

const nodeLines = nodes.map((n) => {
  const fields: string[] = [
    `id: "${n.id}"`,
    `label: ${quote(n.label)}`,
    `description: ${quote(n.description)}`,
  ];
  if (n.url) fields.push(`url: "${n.url}"`);
  fields.push(`tier: "${n.tier}"`);
  if (n.parent) fields.push(`parent: "${n.parent}"`);
  fields.push(`x: ${n.x}`);
  fields.push(`y: ${n.y}`);
  fields.push(`radius: ${n.radius}`);
  fields.push(`color: ${quote(n.color)}`);
  if (n.status) fields.push(`status: "${n.status}"`);
  fields.push(`tags: [${n.tags.map((t) => `"${t}"`).join(", ")}]`);
  return `  { ${fields.join(", ")} },`;
}).join("\n");

const edgeLines = edges
  .map((e) => `  { from: "${e.from}", to: "${e.to}", strength: ${e.strength} },`)
  .join("\n");

const content = `// Auto-generated by gen-graph.ts - do not edit
import type { Node, Edge } from "./graph";

export const generatedNodes: Omit<Node, "baseX" | "baseY">[] = [
${nodeLines}
];

export const generatedEdges: Edge[] = [
${edgeLines}
];
`;

await writeFile(outFile, content);
console.log(`wrote ${nodes.length} nodes and ${edges.length} edges to ${outFile}`);
