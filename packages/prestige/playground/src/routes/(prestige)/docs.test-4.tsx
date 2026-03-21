import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-4";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/test-4')(ContentRoute(contentData));
