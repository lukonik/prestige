import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/auto/auto-3";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/auto/auto-3')(ContentRoute(contentData));
