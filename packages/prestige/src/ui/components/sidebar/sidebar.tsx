import { Link } from "@tanstack/react-router";
import {
  SidebarGroupType,
  SidebarLinkType,
  SidebarType,
} from "../../../vite/core/content/content.types";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

export interface SidebarProps {
  sidebar: SidebarType;
  onLinkClick?: () => void;
}

function SidebarGroup({
  group,
  onLinkClick,
}: {
  group: SidebarGroupType;
  onLinkClick?: () => void;
}) {
  const [open, setIsOpen] = useState(true);
  return (
    <div className="mt-4">
      <button
        className="flex items-center justify-between w-full cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium mb-1">{group.label}</span>
        <ChevronDown size={20} className={clsx("transform transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pl-2 border-l border-gray-200 mb-2">
          {group.items.map((item) => {
            if (typeof item === "string" || "slug" in item) {
              const key = typeof item === "string" ? item : item.slug;
              return <SidebarLink key={key} link={item} onLinkClick={onLinkClick} />;
            }
            return <SidebarGroup key={item.label} group={item} />;
          })}
        </div>
      )}
    </div>
  );
}

function SidebarLink({ link, onLinkClick }: { link: SidebarLinkType; onLinkClick?: () => void }) {
  const slug = `/${link.slug}`;
  return (
    <div>
      <Link
        onClick={onLinkClick}
        activeProps={{ className: "bg-primary text-on-primary" }}
        className="w-full inline-block rounded-sm py-1 px-2 font-light"
        to={slug}
      >
        {link.label}
      </Link>
    </div>
  );
}

export default function Sidebar({ sidebar, onLinkClick }: SidebarProps) {
  return (
    <div className="w-full lg:w-sidebar border-r border-gray-300 p-4 h-full overflow-auto lg:h-main lg:sticky top-header">
      {sidebar.items.map((item) => {
        if (typeof item === "string" || "slug" in item) {
          const key = typeof item === "string" ? item : item.slug;
          return <SidebarLink onLinkClick={onLinkClick} key={key} link={item} />;
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </div>
  );
}
