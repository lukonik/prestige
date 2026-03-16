import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/guides/core-architecture";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/guides/core-architecture')(ContentRoute(contentData));
