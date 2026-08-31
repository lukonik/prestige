import { useState } from "react";

import type { ComponentPropsWithoutRef, Key, ReactNode } from "react";

type SidebarItemBase = {
  /** Stable identity used when the same label or URL appears more than once. */
  id?: Key;
  /** Visible text or custom content for the item. */
  label: ReactNode;
};

/** A navigation destination in a {@link Sidebar}. */
export type SidebarLinkItem = SidebarItemBase & {
  /** Open this link in a new browsing context. */
  external?: boolean;
  /** Destination rendered by the default anchor or a custom link renderer. */
  href: string;
  type: "link";
};

/** A collapsible, recursively nested section in a {@link Sidebar}. */
export type SidebarGroupItem = SidebarItemBase & {
  /** Collapse this group on its initial render. */
  collapsed?: boolean;
  items: ReadonlyArray<SidebarItem>;
  type: "group";
};

/** One node in the recursive sidebar hierarchy. */
export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

export type SidebarLinkRenderState = {
  /** Whether the link matches `Sidebar`'s current URL. */
  active: boolean;
  /** Stable class name used by the default renderer. */
  className: string;
};

export interface SidebarProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> {
  /** URL used to mark one link as the current page. */
  currentHref?: string;
  /** Recursive link and group hierarchy. */
  items: ReadonlyArray<SidebarItem>;
  /** Replace anchor rendering, for example with a client-side router link. */
  renderLink?: (
    item: SidebarLinkItem,
    state: SidebarLinkRenderState,
  ) => ReactNode;
}

/** A Content Collections document or an already-normalized document summary. */
export type SidebarDocument = { title: string } & (
  { _meta: { path: string } } | { slug: string }
);

export interface MapDocumentsToSidebarOptions<
  TDocument extends SidebarDocument,
> {
  /** URL prefix placed before each document slug. */
  basePath?: string;
  /** Optionally group documents by a serializable key. */
  groupBy?: (document: TDocument) => string | undefined;
  /** Convert a group key to its visible label. */
  groupLabel?: (group: string) => ReactNode;
}

type MutableSidebarGroup = Omit<SidebarGroupItem, "items"> & {
  items: Array<SidebarItem>;
};

type SidebarItemsProps = Pick<SidebarProps, "currentHref" | "renderLink"> & {
  depth: number;
  items: ReadonlyArray<SidebarItem>;
};

type SidebarGroupProps = Pick<SidebarProps, "currentHref" | "renderLink"> & {
  depth: number;
  group: SidebarGroupItem;
};

function isExternalLink(item: SidebarLinkItem): boolean {
  return (
    item.external === true || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(item.href)
  );
}

function renderDefaultLink(
  item: SidebarLinkItem,
  { active, className }: SidebarLinkRenderState,
) {
  const external = isExternalLink(item);

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={className}
      data-active={active ? "" : undefined}
      href={item.href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {item.label}
    </a>
  );
}

function SidebarGroup({
  currentHref,
  depth,
  group,
  renderLink,
}: SidebarGroupProps) {
  const [open, setOpen] = useState(!group.collapsed);

  return (
    <details
      className="prestigia-sidebar-group group"
      onToggle={(event) => setOpen(event.currentTarget.open)}
      open={open}
    >
      <summary className="prestigia-sidebar-group-label flex cursor-pointer list-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors after:text-muted-foreground after:transition-transform after:content-['›'] hover:bg-accent group-open:after:rotate-90 [&::-webkit-details-marker]:hidden">
        {group.label}
      </summary>
      <SidebarItems
        currentHref={currentHref}
        depth={depth + 1}
        items={group.items}
        renderLink={renderLink}
      />
    </details>
  );
}

function SidebarItems({
  currentHref,
  depth,
  items,
  renderLink,
}: SidebarItemsProps) {
  const listClassName =
    depth === 0
      ? "prestigia-sidebar-list space-y-3"
      : "prestigia-sidebar-list mt-1 ml-2 space-y-1 border-l pl-3";

  return (
    <ul className={listClassName} data-depth={depth}>
      {items.map((item, index) => {
        const key = item.id ?? (item.type === "link" ? item.href : index);

        if (item.type === "group") {
          return (
            <li className="prestigia-sidebar-item" key={key}>
              <SidebarGroup
                currentHref={currentHref}
                depth={depth}
                group={item}
                renderLink={renderLink}
              />
            </li>
          );
        }

        const state = {
          active: currentHref === item.href,
          className:
            "prestigia-sidebar-link block rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-active:bg-accent data-active:font-medium data-active:text-accent-foreground",
        } satisfies SidebarLinkRenderState;

        return (
          <li className="prestigia-sidebar-item" key={key}>
            {renderLink
              ? renderLink(item, state)
              : renderDefaultLink(item, state)}
          </li>
        );
      })}
    </ul>
  );
}

function documentHref(basePath: string, slug: string): string {
  const normalizedBasePath = basePath.replace(/^\/+|\/+$/gu, "");
  const normalizedSlug = slug.replace(/^\/+|\/+$/gu, "");

  return `/${[normalizedBasePath, normalizedSlug].filter(Boolean).join("/")}`;
}

/** Map Content Collections document summaries to sidebar links and groups. */
export function mapDocumentsToSidebar<TDocument extends SidebarDocument>(
  documents: ReadonlyArray<TDocument>,
  {
    basePath = "/docs",
    groupBy,
    groupLabel = (group) => group,
  }: MapDocumentsToSidebarOptions<TDocument> = {},
): Array<SidebarItem> {
  const items: Array<SidebarItem> = [];
  const groups = new Map<string, MutableSidebarGroup>();

  for (const document of documents) {
    const slug = "slug" in document ? document.slug : document._meta.path;
    const link = {
      type: "link",
      label: document.title,
      href: documentHref(basePath, slug),
    } satisfies SidebarLinkItem;
    const groupKey = groupBy?.(document);

    if (!groupKey) {
      items.push(link);
      continue;
    }

    const existingGroup = groups.get(groupKey);

    if (existingGroup) {
      existingGroup.items.push(link);
      continue;
    }

    const group = {
      type: "group",
      label: groupLabel(groupKey),
      items: [link],
    } satisfies MutableSidebarGroup;

    groups.set(groupKey, group);
    items.push(group);
  }

  return items;
}

/** Render an accessible navigation tree containing links and nested groups. */
export function Sidebar({
  "aria-label": ariaLabel = "Documentation",
  className,
  currentHref,
  items,
  renderLink,
  ...navProps
}: SidebarProps) {
  const sidebarClassName = "prestigia-sidebar mx-auto w-full max-w-sm lg:mx-0";
  const resolvedClassName = className
    ? `${sidebarClassName} ${className}`
    : sidebarClassName;

  return (
    <nav {...navProps} aria-label={ariaLabel} className={resolvedClassName}>
      <SidebarItems
        currentHref={currentHref}
        depth={0}
        items={items}
        renderLink={renderLink}
      />
    </nav>
  );
}
