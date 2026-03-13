import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PrestigeNotFound } from "@lonik/prestige/ui";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: PrestigeNotFound,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
