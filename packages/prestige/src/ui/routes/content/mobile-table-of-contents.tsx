import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TocItem, useTableOfContents } from "./table-of-contents/use-table-of-contents";

export function MobileTableOfContent({ toc }: { toc: TocItem[] }) {
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
