import { Link } from "@tanstack/react-router";
import {
  SidebarGroupType,
  SidebarLinkType,
  SidebarType,
} from "../../../vite/core/content/content.types";

export interface SidebarProps {
  sidebar: SidebarType;
}

function SidebarGroup({ group }: { group: SidebarGroupType }) {
  return (
    <>
      <div>{group.label}</div>
      {group.items.map((item) => {
        if (typeof item === "string" || "slug" in item) {
          const key = typeof item === "string" ? item : item.slug;

          return <SidebarLink key={key} link={item} />;
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </>
  );
}

function SidebarLink({ link }: { link: SidebarLinkType }) {
  const slug = `/${link.slug}`;
  return (
    <div>
      <Link to={slug}>{link.label}</Link>
    </div>
  );
}

export default function Sidebar({ sidebar }: SidebarProps) {
  return (
    <div className="w-3xs border-r border-gray-300">
      {sidebar.items.map((item) => {
        if (typeof item === "string" || "slug" in item) {
          const key = typeof item === "string" ? item : item.slug;
          return <SidebarLink key={key} link={item} />;
        }
        return <SidebarGroup key={item.label} group={item} />;
      })}
    </div>
  );
}
