import { z } from "zod";
import { unified } from "unified";
import remarkFrontmatter from "remark-frontmatter";
import { parse } from "yaml";

const fileContent = `---
title: My Cool Post
date: 2026-02-22
---
# Hello World`;

const schema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
});

async function processMarkdown() {
  const processor = unified().use().use(remarkFrontmatter, ["yaml"]); // Tells remark to look for YAML blocks

  const tree = processor.parse(fileContent);

  // The frontmatter is now a node in the tree (usually the first child)
  const frontmatterNode = (tree as any).children.find((node: any) => node.type === "yaml");

  const metadata = frontmatterNode ? parse(frontmatterNode.value) : {};
  schema.parse(metadata);
}

processMarkdown();
