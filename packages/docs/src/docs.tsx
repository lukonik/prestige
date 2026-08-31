import { Link, Outlet, useLocation } from "@tanstack/react-router";

import { Sidebar } from "./sidebar.js";

import type {
  SidebarItem,
  SidebarLinkItem,
  SidebarLinkRenderState,
  SidebarProps,
} from "./sidebar.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface DocsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  /** Child route content. Defaults to TanStack Router's outlet. */
  children?: ReactNode;
  /** URL used to mark a sidebar link as current. */
  currentHref?: string;
  /** Props forwarded to the sidebar navigation. */
  sidebarProps?: Omit<SidebarProps, "currentHref" | "items">;
  /** Recursive navigation rendered next to the child document route. */
  sidebar: ReadonlyArray<SidebarItem>;
}

/** Render the shared layout for a documentation route and its children. */
export function Docs({
  children,
  className,
  currentHref,
  sidebar,
  sidebarProps,
  ...layoutProps
}: DocsProps) {
  const layoutClassName =
    "prestigia-docs min-h-[calc(100svh-4rem)] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]";
  const resolvedClassName = className
    ? `${layoutClassName} ${className}`
    : layoutClassName;

  return (
    <div {...layoutProps} className={resolvedClassName}>
      <aside className="prestigia-docs-sidebar border-b bg-background px-4 py-6 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-6 lg:py-10">
        <Sidebar currentHref={currentHref} {...sidebarProps} items={sidebar} />
      </aside>
      <div className="prestigia-docs-content min-w-0">
        {children ?? <Outlet />}
      </div>
    </div>
  );
}

export interface CreateDocsRouteOptions {
  /** Props used by the default {@link Docs} renderer. */
  docsProps?: Omit<DocsProps, "children" | "currentHref" | "sidebar">;
  /** Static recursive navigation shared by all child document routes. */
  sidebar: ReadonlyArray<SidebarItem>;
}

function isExternalLink(item: SidebarLinkItem): boolean {
  return (
    item.external === true || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(item.href)
  );
}

function renderRouterLink(
  item: SidebarLinkItem,
  { active, className }: SidebarLinkRenderState,
) {
  if (isExternalLink(item)) {
    return (
      <a
        className={className}
        href={item.href}
        rel="noreferrer"
        target="_blank"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={className}
      data-active={active ? "" : undefined}
      to={item.href}
    >
      {item.label}
    </Link>
  );
}

/**
 * Create the component options for a `/docs` file route that owns the sidebar
 * and renders `$slug` routes through its outlet.
 *
 * @example
 * export const Route = createFileRoute("/docs")(
 *   createDocsRoute({ sidebar }),
 * );
 */
export function createDocsRoute({
  docsProps,
  sidebar,
}: CreateDocsRouteOptions) {
  function DocsRouteComponent() {
    const pathname = useLocation({
      select: (location) => location.pathname,
    });

    return (
      <Docs
        {...docsProps}
        currentHref={pathname}
        sidebar={sidebar}
        sidebarProps={{
          renderLink: renderRouterLink,
          ...docsProps?.sidebarProps,
        }}
      />
    );
  }

  return {
    component: DocsRouteComponent,
  };
}
