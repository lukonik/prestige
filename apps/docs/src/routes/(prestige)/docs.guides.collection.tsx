import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/guides/collection";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/guides/collection')(ContentRoute(contentData));
