import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  InternalSidebarLinkType,
  SidebarGroupType,
  SidebarLinkType,
  SidebarType,
} from "../../../vite/core/content/content.types";
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
    <div className="mt-4 flex flex-col gap-1">
      <button
        className="flex items-center w-full gap-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChevronRight
          size={18}
          className={clsx(
            "transform transition cursor-pointer ml-1",
            open && "rotate-90",
          )}
        />
        <span className="font-mono text-xs tracking-widest">
          {group.label.toUpperCase()}
        </span>
      </button>
      {open && (
        <div className="mb-2">
          {group.items.map((item) => {
            if ("slug" in item || "link" in item) {
              const key = "slug" in item ? item.slug : item.link;
              return (
                <SidebarLink showIcon={false} key={key} link={item} onLinkClick={onLinkClick} />
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
  showIcon,
}: {
  link: InternalSidebarLinkType | SidebarLinkType;
  onLinkClick?: (() => void) | undefined;
  showIcon: boolean;
}) {
  if ("slug" in link || !isExternalURL(link.link)) {
    const slug = "slug" in link ? `/${link.slug}` : link.link;
    return (
      <div className="flex items-center ">
        <Link
          onClick={onLinkClick}
          activeProps={{ className: "text-default-700 font-medium" }}
          className="w-full inline-flex gap-2 py-1 px-2 rounded hover:bg-default-100 text-sm mr-2 items-center text-default-500"
          to={slug}
        >
          {showIcon && <BookOpen className="w-4" />}
          {link.label}
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex items-center ">
        <a
          onClick={onLinkClick}
          className="w-full inline-flex gap-2 py-1 px-2 rounded hover:bg-default-100 text-sm mr-2 items-center text-default-500"
          href={link.link}
          target="_blank"
          rel="noreferrer"
        >
          {showIcon && <ExternalLink className="w-4" />}
          {link.label}
        </a>
      </div>
    );
  }
}

export default function Sidebar({ sidebar, onLinkClick }: SidebarProps) {
  return (
    <div className="w-full lg:w-sidebar border-r border-default-200 h-full overflow-auto lg:h-main lg:sticky top-header pt-4">
      {sidebar.items.map((item) => {
        if ("slug" in item || "link" in item) {
          const key = "slug" in item ? item.slug : item.link;
          return (
            <SidebarLink showIcon={true} onLinkClick={onLinkClick} key={key} link={item} />
          );
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </div>
  );
}
