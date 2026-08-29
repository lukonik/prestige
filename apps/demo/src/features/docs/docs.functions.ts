import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
  findDocument,
  getDocumentationSnapshot,
  listDocuments,
} from "./docs.server";
import { docSlugSchema, docsQuerySchema } from "./docs.schema";

export const getDocuments = createServerFn({ method: "GET" })
  .validator(docsQuerySchema)
  .handler(({ data }) => listDocuments(data));

export const getDocument = createServerFn({ method: "GET" })
  .validator(docSlugSchema)
  .handler(({ data }) => {
    const document = findDocument(data.slug);

    if (!document) throw notFound();

    return document;
  });

export const getDocsSnapshot = createServerFn({ method: "GET" }).handler(() =>
  getDocumentationSnapshot(),
);
