import { SidebarItemType, SidebarLinkType, SidebarType } from "./content.types";

export function resolveContentLinks(sidebars: Map<string, SidebarType>) {
  const links = new Map<string, SidebarLinkType[]>();
  for (const [key, sidebar] of sidebars) {
    const sidebarLinks: SidebarLinkType[] = [];
    for (const item of sidebar.items) {
      processItem(item, sidebarLinks);
    }
    links.set(key, sidebarLinks);
  }
  return links;
}

function processItem(item: SidebarItemType, links: SidebarLinkType[] = []) {
  if ("slug" in item) {
    links.push(item);
  } else if ("items" in item) {
    for (const childItem of item.items) {
      processItem(childItem, links);
    }
  }
  return links;
}
