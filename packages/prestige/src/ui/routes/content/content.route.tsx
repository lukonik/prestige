import { TocItem } from "remark-flexible-toc";
import ContentNavigations, { NavigationLink } from "./content-navigations";
import { MobileTableOfContent } from "./table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "./table-of-contents/web-table-of-contents";
import config from "virtual:prestige/config";
import { FunctionComponent } from "react";
import { ContentFrontmatterType } from "../../../vite/core/content/content.types";

export function ContentRoute(inlineData: any) {
  const castedData = inlineData as {
    prev: NavigationLink | null;
    next: NavigationLink | null;
    toc: TocItem[];
    default: FunctionComponent;
    frontmatter: ContentFrontmatterType;
  };
  return {
    head: () => ({
      meta: [
        {
          name: "description",
          content: castedData.frontmatter.description ?? "",
        },
        {
          title: castedData.frontmatter.title ?? "" + " | " + config.title,
        },
      ],
      links: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
      styles: [
        {
          media: "all and (max-width: 500px)",
          children: `p {
                  color: blue;
                  background-color: yellow;
                }`,
        },
      ],
      scripts: [
        {
          src: "https://www.google-analytics.com/analytics.js",
        },
      ],
    }),
    component: () => {
      return (
        <div className="flex lg:gap-6 items-start max-w-[100vw]">
          <div className="flex-1 min-w-0">
            <MobileTableOfContent toc={castedData.toc} />
            <article className="prose prose-base max-w-none wrap-break-word">
              <castedData.default />
            </article>
            <ContentNavigations prev={castedData.prev} next={castedData.next} />
          </div>
          <WebTableOfContent toc={castedData.toc} />
        </div>
      );
    },
  };
}
