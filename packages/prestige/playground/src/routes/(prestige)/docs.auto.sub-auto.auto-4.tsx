import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/auto/sub-auto/auto-4";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/auto/sub-auto/auto-4')(ContentRoute(contentData));
