import { createRoute, RootRoute } from "@tanstack/react-router";
import { Route } from "../routes";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "collection/$slug",
    component: () => {
      const data = Route.useLoaderData();
      return <div>{JSON.stringify(data)}</div>;
    },
  });
  return contentRouter;
}
