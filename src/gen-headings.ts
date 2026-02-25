import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join } from "path";
import { stripFrontmatter } from "./frontmatter";

const contentDir = join(import.meta.dir, "../public/content");
const outFile = join(import.meta.dir, "../public/headings.json");

async function findMarkdownFiles(dir: string, prefix = ""): Promise<{ id: string; path: string }[]> {
  const entries = await readdir(dir);
  const results: { id: string; path: string }[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      const subResults = await findMarkdownFiles(fullPath, prefix ? `${prefix}/${entry}` : entry);
      results.push(...subResults);
    } else if (entry.endsWith(".md")) {
      const basename = entry.replace(/\.md$/, "");
      const id = prefix ? `${prefix}/${basename}` : basename;
      results.push({ id, path: fullPath });
    }
  }

  return results;
}

const headings: { nodeId: string; heading: string; slug: string; body: string }[] = [];

const NAV_HEADINGS = new Set(["related projects", "see also", "what it is"]);

const files = await findMarkdownFiles(contentDir);

for (const { id, path } of files) {
  const raw = await readFile(path, "utf-8");
  const text = stripFrontmatter(raw);

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
