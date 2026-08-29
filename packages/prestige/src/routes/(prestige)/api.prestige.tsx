import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/api/prestige";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/api/prestige')(ContentRoute(contentData));
