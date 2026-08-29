import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-8";
import { LazyContentRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/test-8')(LazyContentRoute(contentData));
