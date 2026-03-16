import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/reference/frontmatter-reference";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/reference/frontmatter-reference')(ContentRoute(contentData));
