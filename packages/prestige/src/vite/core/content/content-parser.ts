import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkToc from "remark-toc";
import rehypeShiki from "@shikijs/rehype";
import { matter } from "vfile-matter";
import { parseWithFriendlyErrors } from "../../utils/errors";
import { ContentSchema } from "./content.types";

export async function parseContent(content: string) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => (_: any, file: any) => matter(file, { strip: true }))
    .use(remarkRehype)
    .use(rehypeShiki, {
      // or `theme` for a single theme
      themes: {
        light: "vitesse-dark",
        dark: "vitesse-dark",
      },
    })
    .use(rehypeStringify); // Stringifies the HTML AST to a standard HTML string

  const result = await processor.process(content);

  const matterResponse: any = result.data["matter"];

  let metadata = null;

  if (matterResponse) {
    metadata = parseWithFriendlyErrors(ContentSchema, matterResponse, `Invalid schema of article`);
  }
  const html = String(result);
  return { html, metadata };
}

export async function parseMetadata(content: string) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => (_: any, file: any) => matter(file, { strip: true }))
    .use(remarkRehype)
    .use(rehypeShiki, {
      // or `theme` for a single theme
      themes: {
        light: "vitesse-dark",
        dark: "vitesse-dark",
      },
    })
    .use(rehypeStringify); // Stringifies the HTML AST to a standard HTML string
  const result = await processor.process(content);

  const matterResponse: any = result.data["matter"];

  let metadata = null;

  if (matterResponse) {
    metadata = parseWithFriendlyErrors(ContentSchema, matterResponse, `Invalid schema of article`);
  }
  return metadata;
}
