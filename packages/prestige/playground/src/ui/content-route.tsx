import { createRoute, RootRoute } from "@tanstack/react-router";
import { Route } from "../routes";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "content/$slug",
    loader: async ({ params }) => {
      const slug = params.slug;
      const content = await import("virtual:contents/" + slug + ".md");
      return content;
    },
    component: () => {
      const data = Route.useLoaderData();
      return <div>{JSON.stringify(data)}</div>;
    },
  });
  return contentRouter;
}
