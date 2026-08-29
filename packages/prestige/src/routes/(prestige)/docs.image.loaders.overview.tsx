import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/image/loaders/overview";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/image/loaders/overview')(ContentRoute(contentData));
