import { createDocRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

export const Route = createFileRoute("/docs/$slug")(
  createDocRoute({
    documents: allDocs,
    docProps: { indexHref: false },
  }),
);
