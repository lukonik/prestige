import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";
import ContentNavigations from "../../components/content-navigations/content-navigations";

import ContentNotFound from "../../components/content-not-found";
import { MobileTableOfContent } from "./table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "./table-of-contents/web-table-of-contents";
import ContentMarkdown from "./content-markdown";

export default function createContentRoute(root: AnyRoute) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$",

    loader: async ({ params }) => {
      const slug = [params["slug"], params["_splat"]].filter(Boolean).join("/");

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

    return (
      <div className="flex xl:gap-10 items-start">
        <div className="flex-1 min-w-0">
          <MobileTableOfContent toc={toc} />
          <article className="prose prose-lg max-w-none wrap-break-word">
            <ContentMarkdown code={code} />
          </article>
          <ContentNavigations prev={prev} next={next} />
        </div>
        <WebTableOfContent toc={toc} />
      </div>
    );
  }

  return contentRouter;
}
