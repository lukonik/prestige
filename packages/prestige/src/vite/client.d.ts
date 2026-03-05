declare module "virtual:prestige" {
  export const contents: string[];
}

declare module "virtual:prestige/content-all" {
  import { Content } from "./core/content/content.types";
  export const contents: Record<string, () => Promise<Content>>;
  export default contents;
}

declare module "virtual:prestige/sidebar-all" {
  export interface SidebarLinkType {
    slug: string;
    label: string;
  }

  export interface SidebarGroupType {
    label: string;
    items: SidebarItemType[];
    collapsible?: boolean | undefined;
  }

  export type SidebarItemType = SidebarLinkType | SidebarGroupType;

  export interface SidebarType {
    items: SidebarItemType[];
    defaultLink: string;
  }

  const sidebars: Record<string, () => Promise<SidebarType>>;
  export default sidebars;
}

declare module "virtual:prestige/collection-all" {
  import { CollectionNavigation } from "./core/content/content.types";
  const collections: Array<CollectionNavigation>;
  export default collections;
}
