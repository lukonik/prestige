import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  SidebarGroupType,
  SidebarLinkType,
  SidebarType,
} from "../../../vite/core/content/content.types";

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
    <div className="mt-4 flex flex-col gap-1">
      
      <button
        className="flex items-center w-full gap-2" 
        onClick={() => setIsOpen((prev) => !prev)}
      >
         <ChevronRight
        size={18}
          className={clsx("transform transition cursor-pointer ml-1", open && "rotate-90")}
        />
        <span className="font-mono text-xs tracking-widest">{group.label.toUpperCase()}</span>
       
      </button>
      {open && (
        <div className="mb-2">
          {group.items.map((item) => {
            if (typeof item === "string" || "slug" in item) {
              const key = typeof item === "string" ? item : item.slug;
              return (
                <SidebarLink key={key} showIcon={false} link={item} onLinkClick={onLinkClick} />
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
  showIcon
}: {
  link: SidebarLinkType;
  onLinkClick?: (() => void) | undefined;
  showIcon:boolean
}) {
  const slug = `/${link.slug}`;
  return (
    <div className="flex items-center " >
      <Link
        onClick={onLinkClick}
        activeProps={{ className: "text-gray-700 font-medium" }}
        className="w-full inline-flex gap-2 py-1 px-2 rounded hover:bg-gray-100 text-sm mr-2 items-center text-gray-500"
        to={slug}
      >
        {showIcon &&<BookOpen className="w-4"/>}
        {link.label}
      </Link>
    </div>
  );
}

export default function Sidebar({ sidebar, onLinkClick }: SidebarProps) {
  return (
    <div className="w-full lg:w-sidebar border-r border-gray-200 h-full overflow-auto lg:h-main lg:sticky top-header pt-4">
      {sidebar.items.map((item) => {
        if (typeof item === "string" || "slug" in item) {
          const key = typeof item === "string" ? item : item.slug;
          return (
            <SidebarLink showIcon={true} onLinkClick={onLinkClick} key={key} link={item} />
          );
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </div>
  );
}