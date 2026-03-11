import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";
import { Compatible } from "vfile";
import { matter } from "vfile-matter";

export async function parseContent(content: Compatible) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => (_: any, file: any) => matter(file, { strip: true }))
    .use(remarkRehype)
    .use(rehypeStringify); // Stringifies the HTML AST to a standard HTML string

  const result = await processor.process(content);

  const html = String(result);
  return html;
}
