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

export const docSearchSchema = z.object({
  section: z.string().trim().max(80).catch("").default(""),
});

export type DocTopic = (typeof docTopics)[number];

export type DocSection = {
  id: string;
  title: string;
  paragraphs: Array<string>;
};

export type Doc = {
  slug: string;
  title: string;
  description: string;
  topic: Exclude<DocTopic, "all">;
  sections: Array<DocSection>;
};

export type DocSummary = Omit<Doc, "sections">;
