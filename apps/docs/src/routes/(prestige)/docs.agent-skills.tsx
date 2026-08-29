import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/agent-skills";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/agent-skills')(ContentRoute(contentData));
