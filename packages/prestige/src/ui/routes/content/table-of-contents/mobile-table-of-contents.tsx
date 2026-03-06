import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TocItem } from "remark-flexible-toc";
import { useTableOfContents } from "./use-table-of-contents";

export function MobileTableOfContent({ toc }: { toc: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeId, handleLinkClick } = useTableOfContents(toc);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (toc.length === 0) {
    return null;
  }

  const activeItem = toc.find((item) => {
    const itemHref = item.href.startsWith("#") ? item.href : `#${item.href}`;
    return itemHref === activeId;
  });

  return (
    <div
      ref={containerRef}
      className="sticky top-header z-30 -mx-6 -mt-10 mb-8 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 lg:hidden"
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>On this page</span>
            <ChevronRight className={clsx("w-4 h-4 transition-transform duration-200", isOpen && "rotate-90")} />
          </div>
          {activeItem && (
            <span className="truncate text-gray-500 dark:text-gray-400 font-normal max-w-[50%] text-right">
              {activeItem.value}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute left-6 right-6 top-full mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
            <ul className="p-4 space-y-2.5 text-sm">
              {toc.map((item) => {
                const itemHref = item.href.startsWith("#") ? item.href : `#${item.href}`;
                const isActive = activeId === itemHref;
                return (
                  <li key={itemHref} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
                    <a
                      href={itemHref}
                      className={clsx(
                        "block transition-colors duration-200 line-clamp-2",
                        isActive
                          ? "text-primary-600 dark:text-primary-400 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                      )}
                      onClick={(e) => {
                        handleLinkClick(e, item.href);
                        setIsOpen(false);
                      }}
                    >
                      {item.value}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
