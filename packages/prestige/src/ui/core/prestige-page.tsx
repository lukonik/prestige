import React from "react";
import { TocItem } from "remark-flexible-toc";
import { MobileTableOfContent } from "../routes/content/table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "../routes/content/table-of-contents/web-table-of-contents";

export interface PrestigePageProps {
  children: React.ReactNode;
  toc?: TocItem[];
}

export function PrestigePage({
  children,
  toc = [],
}: PrestigePageProps) {
  return (
    <div className="flex lg:gap-6 items-start max-w-[100vw]">
      <div className="flex-1 min-w-0">
        <MobileTableOfContent toc={toc} />
        <article className="prose max-w-none wrap-break-word py-15 px-6">
          {children}
        </article>
      </div>
      <WebTableOfContent toc={toc} />
    </div>
  );
}

