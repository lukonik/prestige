import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-7";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/test-7')(ContentRoute(contentData));
