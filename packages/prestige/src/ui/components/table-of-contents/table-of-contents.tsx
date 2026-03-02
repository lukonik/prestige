import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { TocItem, useTableOfContents } from "./use-table-of-contents";
import { useState } from "react";

export interface TableOfContentsProps {
  toc: TocItem[];
}

export function WebTableOfContent({ toc }: TableOfContentsProps) {
  const { activeId, handleLinkClick } = useTableOfContents(toc);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-64 shrink-0 hidden xl:block">
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

export function MobileTableOfContent({ toc }: TableOfContentsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { handleLinkClick } = useTableOfContents(toc);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden ">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex cursor-pointer items-center w-full justify-between bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          <span>On this page</span>
          <ChevronDown
            className={clsx("w-5 h-5 transition duration-300", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <div className="bg-white dark:bg-slate-950 px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <ul className="space-y-2 text-sm">
              {toc.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
                  <a
                    href={`#${item.id}`}
                    className={clsx(
                      "block hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 line-clamp-2",
                      selectedId === item.id
                        ? "text-blue-600 font-medium dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                    onClick={(e) => {
                      handleLinkClick(e, item.id);
                      setSelectedId(item.id);
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
