import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/vite-plugin";
import { LazyContentRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/vite-plugin')(LazyContentRoute(contentData));
