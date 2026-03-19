import { type AnyRouteMatch } from "@tanstack/react-router";
import { FunctionComponent } from "react";
import { TocItem } from "remark-flexible-toc";
import config from "virtual:prestige/config";
import { ContentFrontmatterType } from "../../../vite/core/content/content.types";
import { PrestigePage } from "../../core/prestige-page";
function resolveContentData(inlineData: any) {
  return inlineData as {
    toc: TocItem[];
    default: FunctionComponent;
    frontmatter: ContentFrontmatterType;
    error: Error | undefined;
  };
}

export function ContentRoute(inlineData: any): any {
  const { frontmatter, error } = resolveContentData(inlineData);

  return {
    beforeLoad: () => {
      if (error) {
        throw error;
      }
    },
    head: () => {
      const metas: Array<
        | { name?: string; content?: string; title?: string }
        | Record<string, any>
      > = [];
      const description = frontmatter.description;
      const title = frontmatter.title;
      const head = frontmatter.head;

      if (title) {
        metas.push({
          title: title + " | " + config.title,
        });
      }

      if (description) {
        metas.push({
          name: "description",
          content: description,
        });
      }

      const mergedMeta = head?.meta ? [...metas, ...head.meta] : metas;
      return {
        meta: mergedMeta.length > 0 ? mergedMeta : undefined,
        links: head?.links,
        styles: head?.styles,
        scripts: head?.scripts,
      } as { scripts: AnyRouteMatch["scripts"] };
    },
  };
}

export function LazyContentRoute(inlineData: any): any {
  const { toc, default: Component } = resolveContentData(inlineData);

  return {
    component: () => {
      return (
        <PrestigePage toc={toc}>
          <Component />
        </PrestigePage>
      );
    },
  };
}
