import { compile } from "@mdx-js/mdx";
import { Compatible, VFile } from "vfile";
import rehypeShiki, { RehypeShikiOptions } from "@shikijs/rehype";
import { PluggableList } from "unified";
import { PrestigeConfig } from "../config/config.types";
import rehypeSlug from "rehype-slug";
import remarkFlexibleToc, { TocItem } from "remark-flexible-toc";
import { matter } from "vfile-matter";

export async function compileMarkdown(
  content: Readonly<Compatible>,
  baseUrl: string,
  options?: PrestigeConfig["markdown"],
) {
  const toc: TocItem[] = [];

  const shikiOptions: RehypeShikiOptions = {
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    ...options?.shikiOptions,
  };

  const rehypePlugins: PluggableList = [
    ...(options?.rehypePlugins ?? []),
    [rehypeShiki, shikiOptions],
    rehypeSlug,
  ];

  const remarkPlugins: PluggableList = [
    ...(options?.remarkPlugins ?? []),
    [remarkFlexibleToc, { tocRef: toc }],
  ];

  const code = await compile(content, {
    outputFormat: "program",
    rehypePlugins,
    remarkPlugins,
    baseUrl: baseUrl,
  });
  return { code: String(code), toc };
}

export async function compileMatter(content: Compatible) {
  const vFile = new VFile(content);
  matter(vFile, { strip: true });
  return vFile.data;
}
