import { useLoaderData } from "@tanstack/react-router";

import { Article } from "./article.js";

import type { MarkdownInput } from "@tanstack/markdown";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ArticleProps } from "./article.js";

/** The document fields required by {@link Doc} and {@link createDocRoute}. */
export type DocDocument = {
  content: MarkdownInput;
  description: string;
  title: string;
};

export interface DocProps<
  TDocument extends DocDocument = DocDocument,
> extends Omit<ComponentPropsWithoutRef<"main">, "children"> {
  /** Props forwarded to the Markdown article. */
  articleProps?: Omit<ArticleProps, "content">;
  /** The loaded document to render. */
  document: TDocument;
  /** Label rendered above the title. Set to `false` to omit it. */
  eyebrow?: ReactNode | false;
  /** URL for the documentation index. Set to `false` to omit the link. */
  indexHref?: string | false;
  /** Text for the documentation index link. */
  indexLabel?: ReactNode;
}

/** Render a complete documentation page from a loaded Markdown document. */
export function Doc<TDocument extends DocDocument>({
  articleProps,
  className,
  document,
  eyebrow = "Documentation",
  indexHref = "/",
  indexLabel = "← All documentation",
  ...mainProps
}: DocProps<TDocument>) {
  const resolvedClassName = className
    ? `prestigia-doc ${className}`
    : "prestigia-doc";

  return (
    <main {...mainProps} className={resolvedClassName}>
      {indexHref ? (
        <a className="back-link" href={indexHref}>
          {indexLabel}
        </a>
      ) : null}
      <div className="document-content">
        <header>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 id="document-title">{document.title}</h1>
          <p>{document.description}</p>
        </header>
        <Article
          aria-labelledby="document-title"
          {...articleProps}
          content={document.content}
        />
      </div>
    </main>
  );
}

export type DocHeadOptions = {
  /** Title used before loader data is available. */
  fallbackTitle?: string;
  /** Site name appended to document titles. Set to `false` to omit it. */
  siteName?: string | false;
};

/** Create TanStack Router head metadata for a documentation page. */
export function createDocHead<TDocument extends DocDocument>(
  document: TDocument | undefined,
  {
    fallbackTitle = "Documentation",
    siteName = "Prestigia",
  }: DocHeadOptions = {},
) {
  const title = document?.title ?? fallbackTitle;

  return {
    meta: [
      { title: siteName ? `${title} · ${siteName}` : title },
      ...(document
        ? [{ name: "description", content: document.description }]
        : []),
    ],
  };
}

type GetDocument<TDocument extends DocDocument> = (options: {
  data: { slug: string };
}) => Promise<TDocument> | TDocument;

export interface CreateDocRouteOptions<
  TDocument extends DocDocument = DocDocument,
> extends DocHeadOptions {
  /** Props used by the default {@link Doc} renderer. */
  docProps?: Omit<DocProps<TDocument>, "document">;
  /** A server function that loads one document by slug. */
  getDocument: GetDocument<TDocument>;
  /** Replace the default {@link Doc} renderer. */
  render?: (document: TDocument) => ReactNode;
}

type DocLoaderContext = {
  params: { slug: string };
};

type DocHeadContext<TDocument extends DocDocument> = {
  loaderData?: TDocument;
};

/**
 * Create the loader, metadata, and component options for a `$slug` file route.
 *
 * @example
 * export const Route = createFileRoute("/docs/$slug")(
 *   createDocRoute({ getDocument }),
 * );
 */
export function createDocRoute<TDocument extends DocDocument>({
  docProps,
  fallbackTitle,
  getDocument,
  render,
  siteName,
}: CreateDocRouteOptions<TDocument>) {
  function DocRouteComponent() {
    const document = useLoaderData({ strict: false }) as TDocument;

    return render ? (
      render(document)
    ) : (
      <Doc {...docProps} document={document} />
    );
  }

  return {
    ssr: true as const,
    loader: ({ params }: DocLoaderContext) =>
      getDocument({ data: { slug: params.slug } }),
    head: ({ loaderData }: DocHeadContext<TDocument>) =>
      createDocHead(loaderData, { fallbackTitle, siteName }),
    component: DocRouteComponent,
  };
}
