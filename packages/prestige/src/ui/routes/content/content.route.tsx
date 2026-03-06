import ContentNavigations from "./content-navigations";
import { MobileTableOfContent } from "./table-of-contents/mobile-table-of-contents";
import { WebTableOfContent } from "./table-of-contents/web-table-of-contents";

export function ContentRoute(data: any) {
  return {
    component: () => {
      return (
        <div className="flex xl:gap-10 items-start">
          <div className="flex-1 min-w-0">
            <MobileTableOfContent toc={data.toc} />
            <article className="prose prose-base max-w-none wrap-break-word">
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
