import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound, prestigeRoutes } from "@lonik/prestige/ui";

export function getRouter() {
  const router = createTanStackRouter({
    // 2. Only add the parent (which now holds the children) to the root tree
    routeTree: prestigeRoutes(routeTree),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
