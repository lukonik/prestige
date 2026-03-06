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
      <h3 className="text-xs font-mono mb-4 tracking-widest">ON THIS PAGE</h3>
      <ul className="text-sm">
        {toc.map((item) => (
          <li
            key={item.href}
            // style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}
          >
            <a
              href={`${item.href}`}
              className={clsx(
                "border-l py-1 px-4 block hover:text-zinc-700 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                activeId === item.href ? "text-zinc-700 border-zinc-600 font-medium" : "text-zinc-500  border-zinc-200 ",
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
