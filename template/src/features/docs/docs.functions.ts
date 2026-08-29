import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { findDocument, listDocuments } from "./docs.server";

export const getDocuments = createServerFn({ method: "GET" }).handler(() =>
  listDocuments(),
);

export const getDocument = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().trim().min(1).max(100) }))
  .handler(({ data }) => {
    const document = findDocument(data.slug);

    if (!document) throw notFound();

    return document;
  });
