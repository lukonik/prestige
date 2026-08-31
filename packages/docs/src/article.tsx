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
const articleStyles = [
  "mt-10 text-[0.9375rem] leading-7 text-foreground",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
  "[&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:pt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:scroll-mt-24 [&_h3]:pt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight",
  "[&_li]:mt-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_p]:mt-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted/40 [&_pre]:p-4",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-6 [&_table]:w-full [&_table]:text-sm",
  "[&_td]:border-b [&_td]:p-3 [&_th]:border-b [&_th]:p-3 [&_th]:text-left [&_th]:font-medium",
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6",
].join(" ");
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
    ? `${articleClassName} ${articleStyles} ${className}`
    : `${articleClassName} ${articleStyles}`;

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
