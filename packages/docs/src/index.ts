/** The npm package name retained while Prestigia is rebuilt. */
export const packageName = "@prestigia/docs";

export {
  Article,
  defaultArticleHighlighter,
  defaultArticleThemeCss,
} from "./article.js";
export type { ArticleMarkdownOptions, ArticleProps } from "./article.js";
export { createDocHead, createDocRoute, Doc } from "./doc.js";
export type {
  CreateDocRouteOptions,
  DocDocument,
  DocHeadOptions,
  DocProps,
} from "./doc.js";
