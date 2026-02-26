declare module "virtual:content-collection" {
  export const contents: string[];
}

// private _virtualId = "virtual:content-collection/content/";
// private _virtualIdAll = "virtual:content-collection/content-all";

declare module "virtual:content-collection/content-all" {
  export interface ContentImport {
    slug: string;
    load: () => Promise<Sidebar>;
  }
  const contents: Record<string, Content>;
  export default contents;
}

declare module "virtual:content-collection/sidebar-all" {
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

  export interface SidebarImport {
    slug: string;
    load: () => Promise<Sidebar>;
  }
  const sidebars: Record<string, SidebarImport>;
  export default sidebars;
}

declare module "virtual:content-collection/sidebar/*" {
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

declare module "virtual:content-collection/all" {
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

declare module "virtual:content-collection/content-all" {
  export type CollectionLink = {
    label: string;
    slug: string;
    load: () => Promise<any>;
  };

  // Declared as the default export to match `import Collections from "..."`
  const contents: Array<CollectionLink>;
  export default contents;
}

declare module "virtual:content-collection/content/*" {
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
