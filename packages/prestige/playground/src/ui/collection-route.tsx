import { createRoute, RootRoute } from "@tanstack/react-router";
import { Route } from "../routes";
import collection from "virtual:content-collection";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "collection/$slug",
    loader: async ({ params }) => {
      const slug = params.slug;
      const collectionRecord = collection.find((c: any) => c.slug === slug);
      const content = await collectionRecord.load();
      return content.default.map((d: any) => d.slug);
    },
    component: () => {
      const data = Route.useLoaderData();
      return <div>{JSON.stringify(data)}</div>;
    },
  });
  return contentRouter;
}
