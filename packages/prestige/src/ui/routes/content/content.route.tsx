import { FunctionComponent } from "react";
import { TocItem } from "remark-flexible-toc";
import config from "virtual:prestige/config";
import {
  ContentFrontmatterType,
} from "../../../vite/core/content/content.types";
import { PrestigePage } from "../../core/prestige-page";

function resolveContentData(inlineData: any) {
  return inlineData as {
    toc: TocItem[];
    default: FunctionComponent;
    frontmatter: ContentFrontmatterType;
  };
}

export function ContentRoute(inlineData: any): any {
  const { frontmatter } = resolveContentData(inlineData);

  return {
    head: () => {
      const metas: Array<
        { name: string; content: string } | { title: string }
      > = [];
      const description = frontmatter.description;
      const title = frontmatter.title;

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

      return {
        meta: metas,
      };
    },
  };
}

export function LazyContentRoute(inlineData: any): any {
  const {
    toc,
    default: Component,
  } = resolveContentData(inlineData);

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
