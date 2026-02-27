import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import { ContentType } from "../../vite/core/content/content.types";

export default function createContentRoute(root: AnyRoute) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$",
    loader: async ({ params }) => {
      const slug = [params["slug"], params["_splat"]].filter(Boolean).join("/");

      if (!slug) {
        throw notFound();
      }

      const content = contents[slug];

      if (!content) {
        throw notFound();
      }

      const response = await content();
      console.log("RESPONSE IS ", response);
      if (!response) {
        throw notFound();
      }
      return response;
    },
    component: ContentComponent,
  });

  function ContentComponent() {
    const data: ContentType = contentRouter.useLoaderData();

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: data.html,
        }}
      ></div>
    );
  }

  return contentRouter;
}
