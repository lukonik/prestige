import { useEffect, useState } from "react";
import clsx from "clsx";

export type TocItem = {
  depth: number;
  text: string;
  id: string;
};

export interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const handleScroll = () => {
      const headingElements = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      // Add a slight offset to account for sticky headers or top padding
      const scrollPosition = window.scrollY + 100;

      let currentActiveId = "";
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = element.id;
          break;
        }
      }

      // If we haven't scrolled past the first heading, highlight the first one
      if (!currentActiveId && headingElements.length > 0 && headingElements[0]) {
        currentActiveId = headingElements[0].id;
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // setTimeout to ensure DOM is fully rendered when checking initial offsets
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

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
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  // Update URL hash without jumping
                  window.history.pushState(null, "", `#${item.id}`);
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
