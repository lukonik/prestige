import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/reference/frontmatter-reference";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/reference/frontmatter-reference')(ContentRoute(contentData));
