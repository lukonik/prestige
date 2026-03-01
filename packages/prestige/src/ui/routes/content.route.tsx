import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { lazy, Suspense, useMemo } from "react";

export default function createContentRoute(root: AnyRoute) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$",
    loader: async ({ params, route }) => {
      const parentSlug = route.parentRoute.path;
      const slug = [parentSlug, params["_splat"]].filter(Boolean).join("/");

      const contentFetcher = contents[slug];
      if (!contentFetcher) throw notFound();

      const response = await contentFetcher();
      if (!response) throw notFound();

      // ONLY return serializable data (strings, numbers, objects)
      return {
        code: response.html,
        metadata: response.metadata || {}, // If you have frontmatter
      };
    },
    component: ContentComponent,
  });

  function ContentComponent() {
    const { code } = contentRouter.useLoaderData();

    const Content = useMemo(() => {
      return lazy(
        () =>
          run(code, {
            ...runtime,
            baseUrl: import.meta.url,
          }) as any,
      );
    }, [code]);

    return (
      <article className="prose prose-lg mx-auto max-w-none">
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      </article>
    );
  }

  return contentRouter;
}
