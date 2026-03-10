import { InternalSidebarLinkType, SidebarItemType, SidebarType } from "../core/content/content.types";

export function resolveContentInternalLinks(sidebars: Map<string, SidebarType>) {
  const links = new Map<string, InternalSidebarLinkType[]>();
  for (const [key, sidebar] of sidebars) {
    const sidebarLinks: InternalSidebarLinkType[] = [];
    for (const item of sidebar.items) {
      processItem(item, sidebarLinks);
    }
    links.set(key, sidebarLinks);
  }
  return links;
}

function processItem(item: SidebarItemType, links: InternalSidebarLinkType[] = []) {
  if ("slug" in item) {
    links.push(item);
  } else if ("items" in item) {
    for (const childItem of item.items) {
      processItem(childItem, links);
    }
  }
  return links;
}
