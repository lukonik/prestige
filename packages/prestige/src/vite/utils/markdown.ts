import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkToc from "remark-toc";
import rehypeShiki from "@shikijs/rehype";

export async function processMarkdown(content: string) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkRehype)
    .use(rehypeShiki, {
      // or `theme` for a single theme
      themes: {
        light: "vitesse-dark",
        dark: "vitesse-dark",
      },
    })
    .use(rehypeStringify); // Stringifies the HTML AST to a standard HTML string

  // 3. Process the file through the entire pipeline
  const result = await processor.process(content);

  // 4. Get your final HTML
  const html = String(result);
  return html;
}
