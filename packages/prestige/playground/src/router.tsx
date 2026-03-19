import {
  PrestigeErrorComponent,
  PrestigeNotFoundComponent,
} from "@lonik/prestige/ui";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    // 2. Only add the parent (which now holds the children) to the root tree
    routeTree: routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: PrestigeNotFoundComponent,
    defaultErrorComponent: (err) => <PrestigeErrorComponent {...err} />,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
