import { z } from "zod";

export const PrestigeConfigSchema = z.object({
  title: z.string().describe("The title of your website"),
  description: z.string().optional().describe("The description of your website"),
});

export type PrestigeConfig = z.input<typeof PrestigeConfigSchema>;
