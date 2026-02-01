import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const contentDir = join(import.meta.dir, "../public/content");
const outFile = join(import.meta.dir, "../public/headings.json");

const files = await readdir(contentDir);
const headings: { nodeId: string; heading: string; slug: string; body: string }[] = [];

const NAV_HEADINGS = new Set(["related projects", "see also"]);

for (const file of files) {
  if (!file.endsWith(".md")) continue;
  const id = file.replace(/\.md$/, "");
  const text = await readFile(join(contentDir, file), "utf-8");

  const sections = text.split(/^## /m);
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]!;
    const newlineIdx = section.indexOf("\n");
    if (newlineIdx === -1) continue;
    const heading = section.substring(0, newlineIdx).trim();
    if (NAV_HEADINGS.has(heading.toLowerCase())) continue;

    const body = section.substring(newlineIdx + 1).trim();
    const plainBody = body
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`#]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    const slug = heading
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ nodeId: id, heading, slug, body: plainBody });
  }
}

headings.sort((a, b) => a.nodeId.localeCompare(b.nodeId) || a.heading.localeCompare(b.heading));

await writeFile(outFile, JSON.stringify(headings));
console.log(`wrote ${headings.length} headings to ${outFile}`);
