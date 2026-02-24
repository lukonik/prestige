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
          const { default: response } = await content.load();
          return response;
        }
      }
    },
    component: () => {
      const data = Route.useLoaderData();
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: data.html,
          }}
        ></div>
      );
    },
  });
  return contentRouter;
}
