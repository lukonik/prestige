import { FunctionComponent } from "react";
import { TocItem } from "remark-flexible-toc";
import config from "virtual:prestige/config";
import {
  ContentFrontmatterType,
  SiblingNavigationType,
} from "../../../vite/core/content/content.types";
import { PrestigePage } from "../../core/prestige-page";
export function ContentRoute(inlineData: any): any {
  const {
    frontmatter,
    toc,
    default: Component,
  } = inlineData as {
    prev: SiblingNavigationType | null;
    next: SiblingNavigationType | null;
    toc: TocItem[];
    default: FunctionComponent;
    frontmatter: ContentFrontmatterType;
  };
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
    component: () => {
      return (
        <PrestigePage toc={toc}>
          <Component />
        </PrestigePage>
      );
    },
  };
}
