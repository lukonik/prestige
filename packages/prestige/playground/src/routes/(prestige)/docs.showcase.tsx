import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/showcase";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/showcase')(ContentRoute(contentData));
