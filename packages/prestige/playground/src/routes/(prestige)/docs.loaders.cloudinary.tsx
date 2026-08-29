import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/loaders/cloudinary";
import { ContentRoute } from "@prestigia/docs/ui";

export const Route = createFileRoute('/(prestige)/docs/loaders/cloudinary')(ContentRoute(contentData));
