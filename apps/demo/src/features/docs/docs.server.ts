import "@tanstack/react-start/server-only";

import { allDocs } from "content-collections";

import type { Doc, DocSummary, DocTopic } from "./docs.schema";

const documents: Array<Doc> = allDocs
  .slice()
  .sort((left, right) => left.order - right.order)
  .map((document) => ({
    content: document.content,
    slug: document._meta.path,
    title: document.title,
    description: document.description,
    topic: document.topic,
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
    .map(({ content: _content, ...summary }) => summary);
}

export function findDocument(slug: string): Doc | undefined {
  return documents.find((document) => document.slug === slug);
}

export function getDocumentationSnapshot() {
  return {
    documents: documents.length,
    sections: documents.reduce(
      (total, document) =>
        total + (document.content.match(/^##\s+/gm)?.length ?? 0),
      0,
    ),
    generatedAt: new Date().toISOString(),
  };
}
