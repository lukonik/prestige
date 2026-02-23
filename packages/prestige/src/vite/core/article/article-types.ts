import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().describe("The title of the article"),
  describe: z.string().optional().describe("The description of the article"),
  lastUpdated: z.union([z.date(), z.boolean()]).optional(),
  layout: z.string().optional().describe("The layout of the article"),
});
