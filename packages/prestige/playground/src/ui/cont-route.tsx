import { createRoute, RootRoute } from "@tanstack/react-router";
import { Route } from "../routes";
import contents from "virtual:content-collection/content-all";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$",
    loader: async ({ params }) => {
      const segments = params._splat?.split("/").filter(Boolean);
      if (segments) {
        const content = contents.find(
          (c: any) => c.slug === segments.join("/"),
        );
        if (content) {
          console.log("CONTENT IS ,", content);
          const response = await content.load();
          console.log("RESPONSE IS" + response);
        }
      }
    },
    component: () => {
      const data = Route.useLoaderData();
      return <div>{JSON.stringify(data)}</div>;
    },
  });
  return contentRouter;
}
