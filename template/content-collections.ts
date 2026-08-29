import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    content: z.string(),
  }),
});

export default defineConfig({
  content: [docs],
});
