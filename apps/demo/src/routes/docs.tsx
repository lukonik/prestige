import { createDocsRoute, mapDocumentsToSidebar } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

function formatGroupLabel(group: string): string {
  return `${group.charAt(0).toLocaleUpperCase()}${group.slice(1)}`;
}

const sidebar = mapDocumentsToSidebar(allDocs, {
  groupBy: (document) => document.topic,
  groupLabel: formatGroupLabel,
});

export const Route = createFileRoute("/docs")(createDocsRoute({ sidebar }));
