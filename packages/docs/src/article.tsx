import { createHighlighter } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { html } from "@tanstack/highlight/languages/html";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { markdown } from "@tanstack/highlight/languages/markdown";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { yaml } from "@tanstack/highlight/languages/yaml";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import { createThemeCss } from "@tanstack/highlight/theme";
import { githubDarkTheme } from "@tanstack/highlight/themes/github-dark";
import { githubLightTheme } from "@tanstack/highlight/themes/github-light";
import { Markdown } from "@tanstack/markdown/react";

import type { CodeHighlighter, MarkdownInput } from "@tanstack/markdown";
import type { MarkdownProps } from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef } from "react";

const articleClassName = "prestigia-article";
const articleHighlighter = createHighlighter({
  languages: [
    plaintext,
    html,
    css,
    js,
    jsx,
    ts,
    tsx,
    json,
    markdown,
    shell,
    yaml,
  ],
});

/** The default syntax highlighter used by {@link Article}. */
export const defaultArticleHighlighter: CodeHighlighter =
  createTanStackMarkdownHighlighter(articleHighlighter);

/**
 * Light and dark syntax colors for the default Article highlighter.
 *
 * The dark theme activates when an Article has a `.dark` ancestor. Pass a
 * custom `themeCss` string when an application uses a different theme hook.
 */
export const defaultArticleThemeCss = createThemeCss({
  light: githubLightTheme,
  dark: githubDarkTheme,
  lightSelector: `.${articleClassName}`,
  darkSelector: `.dark .${articleClassName}`,
  codeBlockSelector: `.${articleClassName} pre.tm-code`,
  lineNumbersSelector: `.${articleClassName} .tm-code--line-numbers`,
});

export type ArticleMarkdownOptions = Omit<
  MarkdownProps,
  "children" | "highlighter"
>;

export interface ArticleProps extends Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "content"
> {
  /** Markdown source or a pre-parsed TanStack Markdown document. */
  content: MarkdownInput;
  /**
   * Replace the built-in TanStack Highlight adapter, or set this to `false`
   * to render code blocks without syntax highlighting.
   */
  highlighter?: CodeHighlighter | false;
  /** Options forwarded to TanStack Markdown's React renderer. */
  markdownOptions?: ArticleMarkdownOptions;
  /**
   * CSS inserted for highlighted code. Set this to `false` when the
   * application supplies its own theme stylesheet.
   */
  themeCss?: string | false;
}

/** Render Markdown as a semantic, customizable documentation article. */
export function Article({
  className,
  content,
  highlighter = defaultArticleHighlighter,
  markdownOptions,
  themeCss = defaultArticleThemeCss,
  ...articleProps
}: ArticleProps) {
  const resolvedClassName = className
    ? `${articleClassName} ${className}`
    : articleClassName;

  return (
    <article {...articleProps} className={resolvedClassName}>
      {themeCss && highlighter ? (
        <style data-prestigia-article-theme>{themeCss}</style>
      ) : null}
      <Markdown
        headingIds
        {...markdownOptions}
        highlighter={highlighter || undefined}
      >
        {content}
      </Markdown>
    </article>
  );
}
