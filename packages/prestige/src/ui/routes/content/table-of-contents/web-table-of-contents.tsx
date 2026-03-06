import clsx from "clsx";
import { TocItem } from "remark-flexible-toc";
import { useTableOfContents } from "./use-table-of-contents";

export function WebTableOfContent({ toc }: { toc: TocItem[] }) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-64 shrink-0 hidden lg:block">
      <h3 className="text-sm font-semibold mb-4 ">On this page</h3>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.href}
            style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}
          >
            <a
              href={`${item.href}`}
              className={clsx(
                "block hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.href ? "text-primary-600" : "text-gray-500 ",
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
