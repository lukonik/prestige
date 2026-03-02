import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { lazy, Suspense, useMemo } from "react";
import ContentNavigations from "../../components/content-navigations/content-navigations";
import { TableOfContents } from "../../components/table-of-contents/table-of-contents";
import ContentNotFound from "../../components/content-not-found";

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
        toc: response.toc || [],
        prev: response.prev,
        next: response.next,
        metadata: response.metadata || {}, // If you have frontmatter
      };
    },
    component: ContentComponent,
    notFoundComponent: ContentNotFound,
  });

  function ContentComponent() {
    const { code, toc, prev, next } = contentRouter.useLoaderData();
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
      <div className="flex xl:gap-10 items-start">
        <div className="flex-1 min-w-0">
          <article className="prose prose-lg max-w-none wrap-break-word">
            <Suspense fallback={null}>
              <Content />
            </Suspense>
          </article>
          <ContentNavigations prev={prev} next={next} />
        </div>
        <TableOfContents toc={toc} />
      </div>
    );
  }

  return contentRouter;
}
