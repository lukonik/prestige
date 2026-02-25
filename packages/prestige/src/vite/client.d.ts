declare module "virtual:content-collection" {
  export const contents: string[];
}

declare module "virtual:content-collection/sidebars" {
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
    items: SidebarItem[];
  };

  // Declared as the default export to match `import sidebars from "..."`
  const sidebars: Record<string, Sidebar>;
  export default sidebars;
}

declare module "virtual:content-collection/content-all" {
  export type SidebarLink = {
    label: string;
    slug: string;
    load: () => Promise<any>;
  };

  // Declared as the default export to match `import sidebars from "..."`
  const contents: Array<SidebarLink>;
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

  // Declared as the default export to match `import sidebars from "..."`
  const contents: Array<Content>;
  export default contents;
}
