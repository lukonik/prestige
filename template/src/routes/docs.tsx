import { createDocsRoute, mapDocumentsToSidebar } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

const sidebar = mapDocumentsToSidebar(allDocs);

export const Route = createFileRoute("/docs")(createDocsRoute({ sidebar }));
