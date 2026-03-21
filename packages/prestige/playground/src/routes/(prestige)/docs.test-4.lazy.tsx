import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-4";
import { LazyContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/test-4')(LazyContentRoute(contentData));
