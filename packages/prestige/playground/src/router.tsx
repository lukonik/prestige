import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import contRoute from "./ui/cont-route";
import sidebarRoute from "./ui/sidebar-route";

const sidebarEntity = sidebarRoute(routeTree as any);
const contentEntity = contRoute(sidebarEntity as any);

// 1. Nest the child route INSIDE the parent route
const sidebarWithChildren = sidebarEntity.addChildren([contentEntity]);

export function getRouter() {
  const router = createTanStackRouter({
    // 2. Only add the parent (which now holds the children) to the root tree
    routeTree: routeTree.addChildren([sidebarWithChildren]),
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
