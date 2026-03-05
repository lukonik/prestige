import { AnyRoute, createRoute, notFound } from "@tanstack/react-router";
import contents from "virtual:prestige/content-all";

import ContentNotFound from "../../components/content-not-found";
import React, { useEffect, useState } from "react";
import { TocItem } from "remark-flexible-toc";
import { SidebarLinkType } from "../../../vite/core/content/content.types";
import ContentNavigations from "../../components/content-navigations/content-navigations";
import { MobileTableOfContent } from "./table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "./table-of-contents/web-table-of-contents";

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
    const params = contentRouter.useParams();
    const [Content, setContent] = useState<React.ElementType>();
    const [toc, setToc] = useState<TocItem[]>();
    const [prev, setPrev] = useState<SidebarLinkType>();
    const [next, setNext] = useState<SidebarLinkType>();

    const slug = [params["slug"], params["_splat"]].filter(Boolean).join("/");

    useEffect(() => {
      const contentFetcher = contents[slug];
      if (!contentFetcher) {
        return;
      }
      contentFetcher().then((data) => {
        setContent(() => data.default);
        setToc(data.toc);
        setPrev(data.prev);
        setNext(data.next);
      });
    }, [slug]);

    return (
      <div className="flex xl:gap-10 items-start">
        <div className="flex-1 min-w-0">
          {toc && <MobileTableOfContent toc={toc} />}
          <article className="prose prose-lg max-w-none wrap-break-word">
            {Content && <Content />}
          </article>
          {prev && next && <ContentNavigations prev={prev} next={next} />}
        </div>
        {toc && <WebTableOfContent toc={toc} />}
      </div>
    );
  }

  return contentRouter;
}
