import React from "react";
import { MobileTableOfContent } from "../routes/content/table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "../routes/content/table-of-contents/web-table-of-contents";
import ContentNavigations, {
  NavigationLink,
} from "../routes/content/content-navigations";
import { TocItem } from "remark-flexible-toc";

export interface PrestigePageProps {
  children: React.ReactNode;
  toc?: TocItem[];
  prev?: NavigationLink | null;
  next?: NavigationLink | null;
}

export function PrestigePage({
  children,
  toc = [],
  prev = null,
  next = null,
}: PrestigePageProps) {
  return (
    <div className="flex lg:gap-6 items-start max-w-[100vw]">
      <div className="flex-1 min-w-0">
        <MobileTableOfContent toc={toc} />
        <article className="prose prose-base max-w-none wrap-break-word py-15">
          {children}
        </article>
        <ContentNavigations prev={prev} next={next} />
      </div>
      <WebTableOfContent toc={toc} />
    </div>
  );
}
