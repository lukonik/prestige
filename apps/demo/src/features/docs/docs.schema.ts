import { z } from "zod";

export const docTopics = ["all", "package", "skill", "workflow"] as const;

export const docsSearchSchema = z.object({
  q: z.string().trim().max(80).catch("").default(""),
  topic: z.enum(docTopics).catch("all").default("all"),
});

export const docsQuerySchema = z.object({
  query: z.string().trim().max(80),
  topic: z.enum(docTopics),
});

export const docSlugSchema = z.object({
  slug: z.string().trim().min(1).max(80),
});

export type DocTopic = (typeof docTopics)[number];

export type Doc = {
  content: string;
  slug: string;
  title: string;
  description: string;
  topic: Exclude<DocTopic, "all">;
};

export type DocSummary = Omit<Doc, "content">;
