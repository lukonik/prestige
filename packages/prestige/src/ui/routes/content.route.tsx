import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { lazy, Suspense, useMemo } from "react";
import ContentNavigations from "../components/content-navigations/content-navigations";

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
        prev: response.prev,
        next: response.next,
        metadata: response.metadata || {}, // If you have frontmatter
      };
    },
    component: ContentComponent,
  });

  function ContentComponent() {
    const { code, prev, next } = contentRouter.useLoaderData();
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
      <>
        <article className="prose prose-lg  max-w-none">
          <Suspense fallback={null}>
            <Content />
          </Suspense>
        </article>
        <ContentNavigations prev={prev} next={next} />
      </>
    );
  }

  return contentRouter;
}
