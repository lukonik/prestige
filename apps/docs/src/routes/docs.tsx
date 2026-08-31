import { createDocsRoute, mapDocumentsToSidebar } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

const sidebar = mapDocumentsToSidebar(allDocs, {
  groupBy: (document) => document.topic,
  groupLabel: (group) => group.charAt(0).toLocaleUpperCase() + group.slice(1),
});

export const Route = createFileRoute("/docs")(createDocsRoute({ sidebar }));
