import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/test-7";
import { LazyContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/docs/test-7')(LazyContentRoute(contentData));
