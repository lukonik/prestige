import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { use, useMemo } from "react";

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

    // 1. Memoize the Promise so it doesn't re-run on every render
    const contentPromise = useMemo(() => {
      return run(code, {
        ...runtime,
        baseUrl: import.meta.url,
      });
    }, [code]);

    // 2. 'use' unwraps the promise.
    // This requires a <Suspense> boundary higher up in your tree.
    const { default: Content } = use(contentPromise);

    return (
      <article className="prose prose-lg mx-auto">
        <Content />
      </article>
    );
  }

  return contentRouter;
}
