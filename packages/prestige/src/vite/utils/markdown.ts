import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { readFile } from "node:fs/promises";

export async function processMarkdown(markdownPath: string) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkRehype) // Converts Markdown AST to HTML AST
    .use(rehypeStringify); // Stringifies the HTML AST to a standard HTML string

  // 2. Read the file
  const file = await readFile(markdownPath);

  // 3. Process the file through the entire pipeline
  const result = await processor.process(file);

  // 4. Get your final HTML
  const html = String(result);
  return html;
}
