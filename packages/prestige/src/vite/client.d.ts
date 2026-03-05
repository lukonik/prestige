declare module "virtual:prestige/content-all" {
  interface ContentType {
    toc: any;
    prev: any;
    next: any;
    default: any;
  }
  export const contents: Record<string, () => Promise<ContentType>>;
  export default contents;
}

declare module "virtual:prestige/sidebar-all" {
  interface SidebarLinkType {
    slug: string;
    label: string;
  }

  interface SidebarGroupType {
    label: string;
    items: SidebarItemType[];
    collapsible?: boolean | undefined;
  }

  type SidebarItemType = SidebarLinkType | SidebarGroupType;

  interface SidebarType {
    items: SidebarItemType[];
    defaultLink: string;
  }

  const sidebars: Record<string, () => Promise<SidebarType>>;
  export default sidebars;
}

declare module "virtual:prestige/collection-all" {
  type CollectionNavigation = {
    id: string;
    label: string;
    defaultLink?: string;
  };
  const collections: Array<CollectionNavigation>;
  export default collections;
}
