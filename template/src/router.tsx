import {
  PrestigeErrorComponent,
  PrestigeNotFoundComponent,
} from "@lonik/prestige/ui";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: PrestigeNotFoundComponent,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: (err) => <PrestigeErrorComponent {...err} />,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
