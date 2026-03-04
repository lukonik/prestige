import { z } from "zod";
import { DEFAULT_DOCS_DIR } from "../constants";
import { CollectionsSchema } from "../core/content/content.types";
import { RehypeShikiOptions } from "@shikijs/rehype";
import { PluggableList } from "unified";

export const PrestigeConfigSchema = z.object({
  title: z.string().describe("The title of your website"),
  description: z.string().optional().describe("The description of your website"),
  docsDir: z
    .string()
    .optional()
    .describe("The directory of your docs, relative to root, defaults to src/content/docs")
    .default(DEFAULT_DOCS_DIR),
  collections: CollectionsSchema,
  markdown: z
    .object({
      shikiOptions: z
        .custom<RehypeShikiOptions>()
        .optional()
        .describe("Options for Shiki syntax highlighting"),
      rehypePlugins: z.custom<PluggableList>().optional().describe("Additional rehype plugins"),
      remarkPlugins: z.custom<PluggableList>().optional().describe("Additional remark plugins"),
    })
    .optional()
    .default({}) // Default to empty object so options?.markdown check is cleaner
    .describe("Markdown options, configure how markdown is parsed"),
});

export type PrestigeConfigInput = z.input<typeof PrestigeConfigSchema>;
export type PrestigeConfig = z.infer<typeof PrestigeConfigSchema>;
