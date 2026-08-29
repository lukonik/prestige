import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/auto/auto-1";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/auto/auto-1')(ContentRoute(contentData));
