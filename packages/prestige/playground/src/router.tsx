import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import collectionRoute from "./ui/collection-route";
export function getRouter() {
  const router = createTanStackRouter({
    routeTree: routeTree.addChildren([collectionRoute(routeTree as any)]),

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
