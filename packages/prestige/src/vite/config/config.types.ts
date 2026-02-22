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

export type PrestigeConfigInput = z.input<typeof PrestigeConfigSchema>;
export type PrestigeConfig = z.infer<typeof PrestigeConfigSchema>;
