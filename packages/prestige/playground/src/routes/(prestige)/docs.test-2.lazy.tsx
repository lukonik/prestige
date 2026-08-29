import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-2";
import { LazyContentRoute } from "@prestigia/docs/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/test-2')(LazyContentRoute(contentData));
