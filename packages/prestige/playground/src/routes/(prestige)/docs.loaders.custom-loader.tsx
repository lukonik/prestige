import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/loaders/custom-loader";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createFileRoute('/(prestige)/docs/loaders/custom-loader')(ContentRoute(contentData));
