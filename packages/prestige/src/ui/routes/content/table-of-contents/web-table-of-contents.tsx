import clsx from "clsx";
import { useTableOfContents } from "./use-table-of-contents";
import { TocItem } from "remark-flexible-toc";

export function WebTableOfContent({ toc }: { toc: TocItem[] }) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);
  console.log(toc);
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-64 shrink-0 hidden lg:block">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 dark:text-slate-100">
        On this page
      </h3>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.value} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
            <a
              href={`${item.href}`}
              className={clsx(
                "block hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.href
                  ? "text-blue-600 font-medium dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400",
              )}
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
