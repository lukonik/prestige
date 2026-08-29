import "@tanstack/react-start/server-only";

import { allDocs } from "content-collections";

export type DocSection = {
  id: string;
  title: string;
  paragraphs: Array<string>;
};

export type Doc = {
  slug: string;
  title: string;
  description: string;
  sections: Array<DocSection>;
};

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
    sections: parseSections(document.content),
  }));

export function listDocuments(): Array<Omit<Doc, "sections">> {
  return documents.map(({ sections: _sections, ...document }) => document);
}

export function findDocument(slug: string): Doc | undefined {
  return documents.find((document) => document.slug === slug);
}
