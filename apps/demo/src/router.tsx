import { createRoute, createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { contents } from "virtual:contents-map";

const Route = createRoute({
  getParentRoute: () => routeTree,
  path: "content/$slug",
  loader: async ({ params }) => {
    const slug = params.slug;
    if (!contents[slug]) {
      throw new Error("Content not found");
    }
    const content = await contents[slug]();
    return content;
  },
  component: () => {
    const data = Route.useLoaderData();
    return <div>{JSON.stringify(data)}</div>;
  },
});

export function getRouter() {
  const router = createTanStackRouter({
    routeTree: routeTree.addChildren([Route]),

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
