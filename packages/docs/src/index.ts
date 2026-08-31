/** The npm package name retained while Prestigia is rebuilt. */
export const packageName = "@prestigia/docs";

export { resolvePrestigiaSidebar } from "./config.js";
export type {
  PrestigiaSidebarAutogenerateItem,
  PrestigiaSidebarConfigItem,
  PrestigiaSidebarGroupItem,
  PrestigiaSidebarLinkItem,
  PrestigiaSidebarSlugItem,
  ResolvePrestigiaSidebarOptions,
} from "./config.js";

export {
  Article,
  defaultArticleHighlighter,
  defaultArticleThemeCss,
} from "./article.js";
export type { ArticleMarkdownOptions, ArticleProps } from "./article.js";
export { mapDocumentsToSidebar, Sidebar } from "./sidebar.js";
export type {
  MapDocumentsToSidebarOptions,
  SidebarDocument,
  SidebarGroupItem,
  SidebarItem,
  SidebarLinkItem,
  SidebarLinkRenderState,
  SidebarProps,
} from "./sidebar.js";
export { createDocHead, createDocRoute, Doc } from "./doc.js";
export type {
  CreateDocRouteOptions,
  DocDocument,
  DocHeadOptions,
  DocProps,
  DocRouteDocument,
} from "./doc.js";
export { createDocsRoute, Docs } from "./docs.js";
export type { CreateDocsRouteOptions, DocsProps } from "./docs.js";
