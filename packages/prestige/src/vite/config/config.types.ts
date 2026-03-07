import { z } from "zod";
import { DEFAULT_DOCS_DIR } from "../constants";
import { CollectionsSchema } from "../core/content/content.types";
import { RehypeShikiOptions } from "@shikijs/rehype";
import { PluggableList } from "unified";
import { FlexibleTocOptions } from "remark-flexible-toc";
import type { Options as RemarkGfmOptions } from "remark-gfm";

export const PrestigeConfigSchema = z.object({
  title: z.string().describe("The title of your website"),
  favicon: z.string().optional().describe("The favicon of your website"),
  description: z
    .string()
    .optional()
    .describe("The description of your website"),
  docsDir: z
    .string()
    .optional()
    .describe(
      "The directory of your docs, relative to root, defaults to src/content/docs",
    )
    .default(DEFAULT_DOCS_DIR),
  collections: CollectionsSchema,
  algolia: z
    .object({
      appId: z.string().describe("The Algolia App ID"),
      apiKey: z.string().describe("The Algolia Search API Key"),
      indexName: z.string().describe("The Algolia Index Name"),
    })
    .optional()
    .describe("Algolia DocSearch configuration"),
  github: z
    .string()
    .url()
    .optional()
    .describe("GitHub repository URL shown in the header"),
  markdown: z
    .object({
      shikiOptions: z
        .custom<RehypeShikiOptions>()
        .optional()
        .describe("Options for Shiki syntax highlighting"),
      gfmOptions: z
        .custom<RemarkGfmOptions>()
        .optional()
        .describe("Options for remark-gfm"),
      rehypePlugins: z
        .custom<PluggableList>()
        .optional()
        .describe("Additional rehype plugins"),
      remarkPlugins: z
        .custom<PluggableList>()
        .optional()
        .describe("Additional remark plugins"),
      remarkFlexibleToc: z
        .custom<FlexibleTocOptions>()
        .optional()
        .describe("Options for remark-flexible-toc"),
      rehypeSlug: z
        .custom<{
          prefix?: string;
        }>()
        .optional()
        .describe("Options for rehype-slug"),
    })
    .optional()
    .describe("Markdown options, configure how markdown is parsed"),
});

export type PrestigeConfigInput = z.input<typeof PrestigeConfigSchema>;
export type PrestigeConfig = z.infer<typeof PrestigeConfigSchema>;
