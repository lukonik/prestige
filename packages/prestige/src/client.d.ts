declare module "virtual:prestige/content-all" {
  interface TocItem {
    value: string;
    href: string;
    depth: HeadingDepth;
    numbering: number[];
    parent: HeadingParent;
    data?: Record<string, unknown>;
  }

  interface NavigationLink {
    slug: string;
    label: string;
  }

  interface ContentHead {
    meta?: Array<Record<string, any>>;
    links?: Array<Record<string, any>>;
    styles?: Array<Record<string, any>>;
    scripts?: Array<Record<string, any>>;
  }

  interface ContentType {
    toc: TocItem[];
    prev: NavigationLink;
    next: NavigationLink;
    default: React.ElementType;
  }
  export const contents: Record<
    string,
    {
      content: () => Promise<ContentType>;
      head: () => Promise<ContentHead>;
    }
  >;
  export default contents;
}

declare module "virtual:prestige/content/*" {
  export const content: any;
  export default content;
}

declare module "virtual:prestige/sidebar-all" {
  interface SidebarLinkType {
    slug: string;
    label: string;
  }

  interface SidebarGroupType {
    label: string;
    items: SidebarItemType[];
    collapsed?: boolean | undefined;
  }

  type SidebarItemType = SidebarLinkType | SidebarGroupType;

  interface SidebarType {
    items: SidebarItemType[];
    defaultLink: string;
  }

  const sidebars: Record<string, () => Promise<SidebarType>>;
  export default sidebars;
}

declare module "virtual:prestige/sidebar/*" {
  import { SidebarType } from "virtual:prestige/sidebar-all";
  const sidebar: SidebarType;
  export default sidebar;
}

declare module "virtual:prestige/collection-all" {
  type CollectionNavigation = {
    id: string;
    label: string;
    defaultLink: string;
  };
  const collections: Array<CollectionNavigation>;
  export default collections;
}

declare module "virtual:prestige/config" {
  interface AlgoliaOptions {
    appId: string;
    apiKey: string;
    indices: string[];
  }

  interface LicenseOptions {
    label: string;
    url: string;
  }

  interface PrestigeShellProps {
    github?: string;
    algolia?: AlgoliaOptions;
    license?: LicenseOptions;
  }

  interface PrestigeConfig {
    title: string;
    disableLog: boolean;
    enableDebugLog: boolean;
    collections: unknown[];
    prestigeShellProps?: PrestigeShellProps;
    markdown?: {
      gfmOptions?: unknown;
      rehypePlugins?: unknown;
      remarkPlugins?: unknown;
      remarkFlexibleToc?: unknown;
      rehypeSlug?: {
        prefix?: string;
      };
    };
  }
  const config: PrestigeConfig;
  export default config;
}
