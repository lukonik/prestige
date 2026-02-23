import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkToc from "remark-toc";
import rehypeShiki from "@shikijs/rehype";
import { matter } from "vfile-matter";
import { articleSchema } from "./article-types";
import { parseWithFriendlyErrors } from "../../utils/errors";

/**
 * Parse YAML frontmatter and expose it at `file.data.matter`.
 *
 * @returns
 *   Transform.
 */
export default function myUnifiedPluginHandlingYamlMatter() {
  /**
   * Transform.
   *
   * @param {Node} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree: any, file: any) {
    matter(file, { strip: true });
  };
}

export async function parseArticle(content: string) {
  // 1. Set up the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkToc)
    .use(remarkFrontmatter, ["yaml"])
    .use(myUnifiedPluginHandlingYamlMatter)
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

  const matter: any = result.data["matter"];

  let metadata = null;

  if (matter) {
    metadata = parseWithFriendlyErrors(articleSchema, matter, `Invalid schema of article`);
  }

  // 4. Get your final HTML
  const html = String(result);
  return { html, metadata };
}
