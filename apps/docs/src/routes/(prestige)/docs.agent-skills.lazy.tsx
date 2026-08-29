import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/agent-skills";
import { LazyContentRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/agent-skills')(LazyContentRoute(contentData));
