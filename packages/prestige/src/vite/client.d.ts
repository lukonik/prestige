declare module "virtual:prestige" {
  export const contents: string[];
}

declare module "virtual:prestige/content-all" {
  export type Content =
    | {
        html: string;
        metadata: {
          title: string;
          describe?: string | undefined;
          lastUpdated?: boolean | Date | undefined;
        } | null;
      }
    | undefined;
  export const contents: Record<string, () => Promise<Content>>;

  export default contents;
}

declare module "virtual:prestige/sidebar-all" {
  export type SidebarLink = {
    label: string;
    slug: string;
  };

  export type SidebarGroup = {
    label: string;
    items: SidebarItem[];
    collapsible?: boolean | undefined;
  };

  export type SidebarItem = SidebarLink | SidebarGroup;

  // Removed the array brackets `[]` at the end
  export type Sidebar = {
    id: string;
    items: CollectionItem[];
  };

  const sidebars: Record<string, () => Promise<Sidebar>>;
  export default sidebars;
}

declare module "virtual:prestige/sidebar/*" {
  export type SidebarLink = {
    label: string;
    slug: string;
  };

  export type SidebarGroup = {
    label: string;
    items: SidebarItem[];
    collapsible?: boolean | undefined;
  };

  export type SidebarItem = SidebarLink | SidebarGroup;

  // Removed the array brackets `[]` at the end
  export type Sidebar = {
    id: string;
    items: CollectionItem[];
  };

  const sidebar: Sidebar;
  export default sidebar;
}

declare module "virtual:prestige/all" {
  export type CollectionLink = {
    label: string;
    slug: string;
  };

  export type CollectionGroup = {
    label: string;
    items: CollectionItem[];
    collapsible?: boolean | undefined;
  };

  export type CollectionItem = CollectionLink | CollectionGroup;

  // Removed the array brackets `[]` at the end
  export type Collection = {
    id: string;
    items: CollectionItem[];
  };

  // Declared as the default export to match `import Collections from "..."`
  const Collections: Record<string, Collection>;
  export default Collections;
}

declare module "virtual:prestige/content-all" {
  export type CollectionLink = {
    label: string;
    slug: string;
    load: () => Promise<any>;
  };

  // Declared as the default export to match `import Collections from "..."`
  const contents: Array<CollectionLink>;
  export default contents;
}

declare module "virtual:prestige/content/*" {
  export type Content =
    | {
        html: string;
        metadata: {
          title: string;
          describe?: string | undefined;
          lastUpdated?: boolean | Date | undefined;
        } | null;
      }
    | undefined;

  // Declared as the default export to match `import Collections from "..."`
  const contents: Array<Content>;
  export default contents;
}
