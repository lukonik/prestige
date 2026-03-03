import clsx from "clsx";
import { TocItem, useTableOfContents } from "./use-table-of-contents";

export function WebTableOfContent({ toc }: { toc: TocItem[] }) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);

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
          <li key={item.id} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
            <a
              href={`#${item.id}`}
              className={clsx(
                "block hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.id
                  ? "text-blue-600 font-medium dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400",
              )}
              onClick={(e) => handleLinkClick(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
