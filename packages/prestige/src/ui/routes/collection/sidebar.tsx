import { Link } from "@tanstack/react-router";
import {
  SidebarGroupType,
  InternalSidebarLinkType,
  SidebarType,
  SidebarLinkType,
} from "../../../vite/core/content/content.types";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { isExternalURL } from "../../utils";

export interface SidebarProps {
  sidebar: SidebarType;
  onLinkClick?: (() => void) | undefined;
}

function SidebarGroup({
  group,
  onLinkClick,
}: {
  group: SidebarGroupType;
  onLinkClick?: (() => void) | undefined;
}) {
  const [open, setIsOpen] = useState(true);
  return (
    <div className="mt-4">
      <button
        className="flex items-center justify-between w-full cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium mb-1">{group.label}</span>
        <ChevronDown
          size={20}
          className={clsx("transform transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="pl-2 border-l border-gray-200 mb-2">
          {group.items.map((item) => {
            if ("slug" in item || "link" in item) {
              const key = "slug" in item ? item.slug : item.link;
              return (
                <SidebarLink key={key} link={item} onLinkClick={onLinkClick} />
              );
            }
            return <SidebarGroup key={item.label} group={item} />;
          })}
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  link,
  onLinkClick,
}: {
  link: InternalSidebarLinkType | SidebarLinkType;
  onLinkClick?: (() => void) | undefined;
}) {
  if ("slug" in link || !isExternalURL(link.link)) {
    const slug = "slug" in link ? `/${link.slug}` : link.link;
    return (
      <Link
        onClick={onLinkClick}
        activeProps={{ className: "bg-primary text-on-primary" }}
        className="w-full inline-block rounded-sm py-1 px-2 font-light"
        to={slug}
      >
        {link.label}
      </Link>
    );
  } else {
    return (
      <a
        onClick={onLinkClick}
        className="w-full inline-block rounded-sm py-1 px-2 font-light"
        href={link.link}
        target="_blank"
        rel="noreferrer"
      >
        {link.label}
      </a>
    );
  }
}

export default function Sidebar({ sidebar, onLinkClick }: SidebarProps) {
  return (
    <div className="w-full lg:w-sidebar border-r border-gray-300 p-4 h-full overflow-auto lg:h-main lg:sticky top-header">
      {sidebar.items.map((item) => {
        if ("slug" in item || "link" in item) {
          const key = "slug" in item ? item.slug : item.link;
          return (
            <SidebarLink onLinkClick={onLinkClick} key={key} link={item} />
          );
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </div>
  );
}
