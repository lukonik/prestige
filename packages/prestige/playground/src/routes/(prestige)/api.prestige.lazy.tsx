import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/api/prestige";
import { LazyContentRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/api/prestige')(LazyContentRoute(contentData));
