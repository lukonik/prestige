import { createDocsRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import config from "virtual:prestigia/config";

export const Route = createFileRoute("/docs")(
  createDocsRoute({ sidebar: config.sidebar }),
);
