/** Markdown → HTML using remark+rehype. */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);

export function parseMarkdown(src: string): string {
  // Strip YAML frontmatter if present
  let body = src;
  if (src.startsWith("---\n")) {
    const end = src.indexOf("\n---", 4);
    if (end !== -1) body = src.slice(end + 4).trimStart();
  }
  return String(processor.processSync(body));
}
