import "@tanstack/react-start/server-only";

import { allDocs } from "content-collections";

export type Doc = {
  content: string;
  slug: string;
  title: string;
  description: string;
};

const documents: Array<Doc> = allDocs
  .slice()
  .sort((left, right) => left.order - right.order)
  .map((document) => ({
    content: document.content,
    slug: document._meta.path,
    title: document.title,
    description: document.description,
  }));

export function listDocuments(): Array<Omit<Doc, "content">> {
  return documents.map(({ content: _content, ...document }) => document);
}

export function findDocument(slug: string): Doc | undefined {
  return documents.find((document) => document.slug === slug);
}
