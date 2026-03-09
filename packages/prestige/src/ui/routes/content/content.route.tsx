import { FunctionComponent } from "react";
import { TocItem } from "remark-flexible-toc";
import { ContentFrontmatterType } from "../../../vite/core/content/content.types";
import {
  PrestigeRootRouteContextOptions
} from "../prestige-root-route";
import ContentNavigations, { NavigationLink } from "./content-navigations";
import { MobileTableOfContent } from "./table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "./table-of-contents/web-table-of-contents";

export function ContentRoute(inlineData: any): any {
  const {
    frontmatter,
    prev,
    next,
    toc,
    default: Component,
  } = inlineData as {
    prev: NavigationLink | null;
    next: NavigationLink | null;
    toc: TocItem[];
    default: FunctionComponent;
    frontmatter: ContentFrontmatterType;
  };
  return {
    head: ({ match }: { match: any }) => {
      const prestigeOptions = match.context
        .prestigeOptions as PrestigeRootRouteContextOptions;

      const metas: Array<
        { name: string; content: string } | { title: string }
      > = [];
      const description =
        frontmatter.description ?? prestigeOptions.description;

      let title = prestigeOptions.title;

      if (frontmatter.title) {
        title = `${frontmatter.title} | ${prestigeOptions.title} `;
      }

      metas.push({
        title: title,
      });

      if (description) {
        metas.push({
          name: "description",
          content: description,
        });
      }

      return {
        meta: metas,
      };
    },
    component: () => {
      return (
        <div className="flex lg:gap-6 items-start max-w-[100vw]">
          <div className="flex-1 min-w-0">
            <MobileTableOfContent toc={toc} />
            <article className="prose max-w-none wrap-break-word py-15 px-6">
              <Component />
            </article>
            <ContentNavigations prev={prev} next={next} />
          </div>
          <WebTableOfContent toc={toc} />
        </div>
      );
    },
  };
}
