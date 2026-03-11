import clsx from "clsx";
import { TocItem } from "remark-flexible-toc";
import { useTableOfContents } from "./use-table-of-contents";

export function WebTableOfContent({ toc }: { toc: TocItem[] }) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);

  return (
    <nav className="sticky top-header pt-4 overflow-y-auto w-web-table-of-content  hidden lg:block">
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
                "border-l py-1 px-4 block hover:text-default-700 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.href
                  ? "text-default-700 border-default-600 font-medium"
                  : "text-default-500  border-default-200 ",
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
