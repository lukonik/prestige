import { ReactNode } from "react";
import { TocItem } from "remark-flexible-toc";
import { SidebarLinkType } from "../../vite/core/content/content.types";
import ContentNavigations from "../components/content-navigations/content-navigations";
import { MobileTableOfContent } from "../routes/content/table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "../routes/content/table-of-contents/web-table-of-contents";

export function ContentComponent({
  toc,
  next,
  prev,
  children,
}: {
  toc: TocItem[];
  prev: SidebarLinkType | null;
  next: SidebarLinkType | null;
  children: ReactNode;
}) {
  return (
    <div className="flex xl:gap-10 items-start">
      <div className="flex-1 min-w-0">
        <MobileTableOfContent toc={toc} />
        <article className="prose prose-lg max-w-none wrap-break-word">
          {children}
        </article>
        <ContentNavigations prev={prev} next={next} />
      </div>
      <WebTableOfContent toc={toc} />
    </div>
  );
}

export function ContentRoute(data: any) {
  return {
    component: () => {
      return (
        <div className="flex xl:gap-10 items-start">
          <div className="flex-1 min-w-0">
            <MobileTableOfContent toc={data.toc} />
            <article className="prose prose-lg max-w-none wrap-break-word">
              <data.default />
            </article>
            <ContentNavigations prev={data.prev} next={data.next} />
          </div>
          <WebTableOfContent toc={data.toc} />
        </div>
      );
    },
  };
}
