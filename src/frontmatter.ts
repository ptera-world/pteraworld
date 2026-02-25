/**
 * Zero-dep YAML frontmatter parser for build-time use.
 * Parses the subset of YAML used in content frontmatter.
 */

export interface Frontmatter {
  label: string;
  description: string;
  tier?: "region" | "project" | "meta";
  parent?: string;
  tags?: string[];
  url?: string;
  status?: "production" | "fleshed-out" | "early" | "planned";
  radius?: number;
  color?: string;
}

/** Strip frontmatter from markdown source, returning the body. */
export function stripFrontmatter(src: string): string {
  if (src.startsWith("---\n")) {
    const end = src.indexOf("\n---", 4);
    if (end !== -1) return src.slice(end + 4).trimStart();
  }
  return src;
}

/** Parse YAML frontmatter from markdown source. Returns null if no frontmatter found. */
export function parseFrontmatter(src: string): Frontmatter | null {
  if (!src.startsWith("---\n")) return null;
  const end = src.indexOf("\n---", 4);
  if (end === -1) return null;

  const yaml = src.slice(4, end);
  const result: Record<string, unknown> = {};

  for (const line of yaml.split("\n")) {
    if (line.trim() === "" || line.startsWith("#")) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value: string | number | string[] = line.slice(colonIdx + 1).trim();

    // Array: [item1, item2]
    if (value.startsWith("[") && value.endsWith("]")) {
      result[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Number
    if (/^\d+(\.\d+)?$/.test(value)) {
      result[key] = Number(value);
      continue;
    }

    result[key] = value;
  }

  // Validate required fields
  if (typeof result.label !== "string" || typeof result.description !== "string") {
    return null;
  }

  return result as unknown as Frontmatter;
}

/** Infer tier from content directory path. */
export function inferTier(category: string): "region" | "project" | "meta" | null {
  switch (category) {
    case "ecosystem":
      return "region";
    case "project":
    case "prose":
      return "project";
    case "meta":
      return "meta";
    default:
      return null;
  }
}

/** Infer auto-tags based on category and tier. */
export function inferTags(category: string, tier: string): string[] {
  const auto: string[] = [];
  if (tier === "project") auto.push("project");
  if (tier === "region") auto.push("region");
  if (tier === "meta") auto.push("meta");
  if (category === "prose") auto.push("essay");
  return auto;
}
