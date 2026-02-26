declare module "virtual:prestige" {
  export const contents: string[];
}

declare module "virtual:prestige/content-all" {
  import { Content } from "./core/content/content.types";
  export const contents: Record<string, () => Promise<Content>>;
  export default contents;
}

declare module "virtual:prestige/sidebar-all" {
  import { Sidebar } from "./core/content/content.types";
  const sidebars: Record<string, () => Promise<Sidebar>>;
  export default sidebars;
}

declare module "virtual:prestige/collection-all" {
  import { Collection } from "./core/content/content.types";
  const Collections: Record<string, Collection>;
  export default Collections;
}
