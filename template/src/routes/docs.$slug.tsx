import { createDocRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";

import { getDocument } from "@/features/docs/docs.functions";

export const Route = createFileRoute("/docs/$slug")(
  createDocRoute({ getDocument }),
);
