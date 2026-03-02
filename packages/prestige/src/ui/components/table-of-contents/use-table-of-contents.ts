import { useEffect, useState } from "react";

export type TocItem = {
  depth: number;
  text: string;
  id: string;
};

export function useTableOfContents(toc: TocItem[]) {
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL hash without jumping
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return { activeId, handleLinkClick };
}
