import { createRoute, RootRoute } from "@tanstack/react-router";
import { Route } from "../routes";
import { contents } from "virtual:contents-map";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
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
  return contentRouter;
}
