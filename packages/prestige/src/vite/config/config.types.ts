import { z } from "zod";

export const PrestigeConfigSchema = z.object({
  title: z.string().describe("The title of your website"),
  description: z.string().optional().describe("The description of your website"),
  docsDir: z
    .string()
    .optional()
    .describe("The directory of your docs, relative to root, defaults to src/content/docs")
    .default("src/content/docs"),
});

export type PrestigeConfig = z.input<typeof PrestigeConfigSchema>;
