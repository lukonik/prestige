import { notFound, useLoaderData } from "@tanstack/react-router";

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

/** A static document with a Content Collections path or explicit slug. */
export type DocRouteDocument = DocDocument &
  ({ _meta: { path: string } } | { slug: string });

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
  const docClassName =
    "prestigia-doc mx-auto w-full max-w-3xl px-6 py-12 lg:px-10 lg:py-16";
  const resolvedClassName = className
    ? `${docClassName} ${className}`
    : docClassName;

  return (
    <main {...mainProps} className={resolvedClassName}>
      {indexHref ? (
        <a
          className="back-link mb-10 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href={indexHref}
        >
          {indexLabel}
        </a>
      ) : null}
      <div className="document-content">
        <header className="border-b pb-8">
          {eyebrow ? (
            <p className="eyebrow mb-3 text-sm font-medium text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
            id="document-title"
          >
            {document.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            {document.description}
          </p>
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

export interface CreateDocRouteOptions<
  TDocument extends DocRouteDocument = DocRouteDocument,
> extends DocHeadOptions {
  /** Props used by the default {@link Doc} renderer. */
  docProps?: Omit<DocProps<TDocument>, "document">;
  /** Static Content Collections documents bundled at build time. */
  documents: ReadonlyArray<TDocument>;
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
 *   createDocRoute({ documents: allDocs }),
 * );
 */
export function createDocRoute<TDocument extends DocRouteDocument>({
  docProps,
  documents,
  fallbackTitle,
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
    loader: ({ params }: DocLoaderContext) => {
      const document = documents.find((candidate) => {
        const slug =
          "slug" in candidate ? candidate.slug : candidate._meta.path;

        return slug === params.slug;
      });

      if (!document) throw notFound();

      return document;
    },
    head: ({ loaderData }: DocHeadContext<TDocument>) =>
      createDocHead(loaderData, { fallbackTitle, siteName }),
    component: DocRouteComponent,
  };
}
