import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-2";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/test-2')(ContentRoute(contentData));
