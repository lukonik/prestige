import clsx from "clsx";
import { TocItem } from "remark-flexible-toc";
import { useTableOfContents } from "./use-table-of-contents";

export function WebTableOfContent({ toc }: { toc: TocItem[] }) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-header h-main pt-4 overflow-y-auto w-64 shrink-0 hidden lg:block">
      <span className="text-xs font-mono tracking-widest">ON THIS PAGE</span>
      <ul className="text-sm my-4">
        {toc.map((item) => (
          <li
            key={item.href}
            // style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}
          >
            <a
              href={`${item.href}`}
              className={clsx(
                "border-l py-1 px-4 block hover:text-gray-700 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.href
                  ? "text-gray-700 border-gray-600 font-medium"
                  : "text-gray-500  border-gray-200 ",
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
