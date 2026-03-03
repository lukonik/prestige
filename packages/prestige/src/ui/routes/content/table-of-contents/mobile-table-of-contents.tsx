import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TocItem, useTableOfContents } from "./use-table-of-contents";

export function MobileTableOfContent({ toc }: { toc: TocItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { handleLinkClick } = useTableOfContents(toc);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="group border border-default-200 rounded-lg overflow-hidden lg:hidden mb-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center w-full justify-between bg-default-50  px-4 py-3 text-sm font-medium text-default-900"
      >
        <span>On this page</span>
        <ChevronDown className={clsx("w-5 h-5 transition duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="bg-white  px-4 py-3 border-t border-default-200 ">
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}>
                <a
                  href={`#${item.id}`}
                  className={clsx(
                    "block hover:text-default-900 dark:hover:text-default-100 transition-colors duration-200 line-clamp-2",
                    selectedId === item.id
                      ? "text-blue-600 font-medium dark:text-blue-400"
                      : "text-default-500 dark:text-default-400",
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
  );
}
