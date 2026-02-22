import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import { parse } from "yaml"; // To turn YAML string into an object
import { z } from "zod";
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
  const processor = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]); // Tells remark to look for YAML blocks

  const tree = processor.parse(fileContent);

  // The frontmatter is now a node in the tree (usually the first child)
  const frontmatterNode = tree.children.find((node) => node.type === "yaml");

  const metadata = frontmatterNode ? parse(frontmatterNode.value) : {};
  schema.parse(metadata);
  console.log("Extracted Metadata:", metadata);
}

processMarkdown();
