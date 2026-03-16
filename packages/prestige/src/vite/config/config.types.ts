import { FlexibleTocOptions } from "remark-flexible-toc";
import type { Options as RemarkGfmOptions } from "remark-gfm";
import { PluggableList } from "unified";
import { z } from "zod";
import { CollectionsSchema } from "../core/content/content.types";

export const PrestigeConfigSchema = z.object({
  title: z.string().describe("Title of the website"),
  disableLog: z
    .boolean()
    .optional()
    .default(false)
    .describe("Disable logger, default is false"),
  enableDebugLog: z
    .boolean()
    .optional()
    .default(false)
    .describe("Enable debug log, default is false"),
  collections: CollectionsSchema,
  markdown: z
    .object({
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
