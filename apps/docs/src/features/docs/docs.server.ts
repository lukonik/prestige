import "@tanstack/react-start/server-only";

import { allDocs } from "content-collections";

import type { Doc, DocSection, DocSummary, DocTopic } from "./docs.schema";

function toId(title: string): string {
  return title
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSections(content: string): Array<DocSection> {
  const sections: Array<DocSection> = [];
  let currentSection: DocSection | undefined;

  for (const block of content.trim().split(/\n\s*\n/)) {
    if (block.startsWith("## ")) {
      const title = block.slice(3).trim();
      currentSection = { id: toId(title), title, paragraphs: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection) currentSection.paragraphs.push(block.trim());
  }

  return sections;
}

const documents: Array<Doc> = allDocs
  .slice()
  .sort((left, right) => left.order - right.order)
  .map((document) => ({
    slug: document._meta.path,
    title: document.title,
    description: document.description,
    topic: document.topic,
    sections: parseSections(document.content),
  }));

export function listDocuments(input: {
  query: string;
  topic: DocTopic;
}): Array<DocSummary> {
  const query = input.query.toLocaleLowerCase();

  return documents
    .filter(
      (document) => input.topic === "all" || document.topic === input.topic,
    )
    .filter((document) => {
      if (!query) return true;

      return [document.title, document.description, document.topic].some(
        (value) => value.toLocaleLowerCase().includes(query),
      );
    })
    .map(({ sections: _sections, ...summary }) => summary);
}

export function findDocument(slug: string): Doc | undefined {
  return documents.find((document) => document.slug === slug);
}

export function getDocumentationSnapshot() {
  const sections = documents.reduce(
    (total, document) => total + document.sections.length,
    0,
  );

  return {
    documents: documents.length,
    sections,
    generatedAt: new Date().toISOString(),
  };
}
