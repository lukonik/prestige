import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/guides/pages";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/guides/pages')(ContentRoute(contentData));
