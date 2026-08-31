import { z } from "zod";

export const docTopics = ["all", "package", "skill", "workflow"] as const;

export const docsSearchSchema = z.object({
  q: z.string().trim().max(80).catch("").default(""),
  topic: z.enum(docTopics).catch("all").default("all"),
});
