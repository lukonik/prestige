import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import contRoute from "./ui/cont-route";
export function getRouter() {
  const router = createTanStackRouter({
    routeTree: routeTree.addChildren([contRoute(routeTree as any)]),

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
