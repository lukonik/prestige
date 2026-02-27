import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import { ContentType } from "../../vite/core/content/content.types";
export default function createContentRoute(root: AnyRoute) {
  const contentRouter = createRoute({
    getParentRoute: () => root,

    path: "$",
    loader: async ({ params, route }) => {
      const parentSlug = route.parentRoute.path;
      const slug = [parentSlug, params["_splat"]].filter(Boolean).join("/");
      console.log(slug);
      if (!slug) {
        throw notFound();
      }

      const content = contents[slug];
      if (!content) {
        throw notFound();
      }

      const response = await content();
      if (!response) {
        throw notFound();
      }
      return response;
    },
    component: ContentComponent,
  });

  function ContentComponent() {
    const data: ContentType = contentRouter.useLoaderData();

    return <div>{JSON.stringify(data)}</div>;
  }

  return contentRouter;
}
