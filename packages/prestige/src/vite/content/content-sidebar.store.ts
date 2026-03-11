import { readdir } from "node:fs/promises";
import { basename } from "node:path";
import { join } from "pathe";
import {
  Collection,
  CollectionGroup,
  CollectionItem,
  Collections,
  ExternalSidebarLinkType,
  InternalCollectionLink,
  InternalSidebarLinkType,
  NavigationLinks,
  SiblingNavigationType,
  SidebarGroupType,
  SidebarItemType,
  SidebarType,
} from "../core/content/content.types";
import { PrestigeError } from "../utils/errors";
import { pathExists } from "../utils/file-utils";
import logger from "../utils/logger";
import { compileFrontmatter } from "./content-compiler";
import { getFileBySlug } from "./content.store";

export const SIDEBAR_VIRTUAL_ID = "virtual:prestige/sidebar/";

function flattenSidebar(items: SidebarItemType[]): SiblingNavigationType[] {
  return items.flatMap((item) => {
    if ("slug" in item) {
      return [{ label: item.label, link: `/${item.slug}` }];
    }
    if ("link" in item) {
      // Ignore external links
      if (item.link.startsWith("http://") || item.link.startsWith("https://")) {
        return [];
      }
      return [{ label: item.label, link: item.link }];
    }
    if ("items" in item) {
      return flattenSidebar(item.items);
    }
    return [];
  });
}

function computeNavigation(
  items: SidebarItemType[],
): Record<string, NavigationLinks> {
  const flattenedLinks = flattenSidebar(items);
  const navigation: Record<string, NavigationLinks> = {};

  for (let i = 0; i < flattenedLinks.length; i++) {
    const link = flattenedLinks[i];
    if (link) {
      navigation[link.link] = {
        prev: i > 0 ? flattenedLinks[i - 1] : null,
        next: i < flattenedLinks.length - 1 ? flattenedLinks[i + 1] : null,
      };
    }
  }

  return navigation;
}

function resolveDefaultLink(
  items: SidebarItemType[],
  defaultLink?: string,
): string | undefined {
  if (defaultLink) {
    return defaultLink;
  }
  for (const item of items) {
    if ("slug" in item) {
      return item.slug;
    } else if ("link" in item) {
      return item.link;
    } else if ("items" in item && item.items.length > 0) {
      const link = resolveDefaultLink(item.items);
      if (link) return link;
    }
  }
  return undefined;
}

export async function resolveSidebars(
  collections: Collections,
  contentDir: string,
) {
  const store = new Map<string, SidebarType>();

  for (const collection of collections) {
    const sidebar = await processCollection(collection, contentDir);
    store.set(collection.id, sidebar);
  }
  return store;
}

/** @visibleForTesting */
async function processCollection(
  collection: Collection,
  contentDir: string,
): Promise<SidebarType> {
  const items: SidebarItemType[] = [];
  for (const item of collection.items) {
    items.push(await processItem(item, contentDir));
  }
  const defaultLink = resolveDefaultLink(items, collection.defaultLink);
  if (!defaultLink) {
    throw new PrestigeError(
      `No default link found in collection, it means there are no links in the collection. Please define one in ${collection.id}`,
    );
  }
  return {
    items,
    defaultLink: defaultLink,
    navigation: computeNavigation(items),
  };
}

/** @visibleForTesting */
async function processItem(
  item: CollectionItem,
  contentDir: string,
): Promise<SidebarItemType> {
  if (typeof item === "string" || "slug" in item) {
    return resolveInternalSidebarLink(
      item as InternalCollectionLink,
      contentDir,
    );
  } else if ("link" in item) {
    return resolveSidebarLink(item, contentDir);
  } else {
    return resolveSidebarGroup(item as CollectionGroup, contentDir);
  }
}

/** @visibleForTesting */
async function resolveSidebarGroup(
  group: CollectionGroup,
  contentDir: string,
): Promise<SidebarGroupType> {
  const label = await resolveLabel(group, contentDir);
  const items: SidebarItemType[] = [];

  if (group.items?.length && group.autogenerate) {
    logger.warn(
      `${group.label} has both items and autogenerate. Only items will be used.`,
    );
  }

  if (group.items) {
    for (const childItem of group.items) {
      items.push(await processItem(childItem, contentDir));
    }
  } else if (group.autogenerate?.directory) {
    const generatedItems = await autogenerateSidebar(
      group.autogenerate.directory,
      contentDir,
    );
    items.push(...generatedItems);
  }

  return {
    label,
    collapsible: group.collapsible,
    items,
  };
}

/** @visibleForTesting */
async function resolveInternalSidebarLink(
  item: InternalCollectionLink,
  contentDir: string,
): Promise<InternalSidebarLinkType> {
  const label = await resolveLabel(item, contentDir);
  const slug = resolveSlug(item);

  if (slug.startsWith("/") || slug.endsWith("/")) {
    throw new PrestigeError(
      `The slug ${slug} cannot start or end with a slash. Remove it and try again.`,
    );
  }

  if (!slug) {
    throw new PrestigeError(
      `The slug cannot be empty. Remove it and try again. link label is ${label}`,
    );
  }

  return {
    label,
    slug,
  };
}

/** @visibleForTesting */
async function resolveSidebarLink(
  item: ExternalSidebarLinkType,
  contentDir: string,
): Promise<ExternalSidebarLinkType> {
  const label = await resolveLabel(item, contentDir);
  const link = resolveLink(item);

  if (!link) {
    throw new PrestigeError(
      `The link cannot be empty. Remove it and try again. link label is ${label}`,
    );
  }

  return {
    label,
    link,
  };
}

/** @visibleForTesting */
async function autogenerateSidebar(
  directory: string,
  contentDir: string,
): Promise<SidebarItemType[]> {
  const fileExtRegex = /\.mdx?$/i;

  const items: SidebarItemType[] = [];
  const dirPath = join(contentDir, directory);
  if (!(await pathExists(dirPath))) {
    logger.warn(`Directory doesn't exist: ${directory}`);
    return [];
  }

  const dirents = await readdir(dirPath, { withFileTypes: true });
  dirents.sort((a, b) => a.name.localeCompare(b.name));
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const subDir = join(directory, dirent.name);
      const group: CollectionGroup = {
        label: dirent.name,
        autogenerate: { directory: subDir },
      };
      items.push(await resolveSidebarGroup(group, contentDir));
    } else if (dirent.isFile() && fileExtRegex.test(dirent.name)) {
      const fullPath = join(directory, dirent.name);
      const slug = fullPath.replace(fileExtRegex, "");
      items.push(await resolveInternalSidebarLink(slug, contentDir));
    }
  }
  return items;
}

/** @visibleForTesting */
async function resolveLabel(
  item: CollectionItem,
  contentDir: string,
): Promise<string> {
  if (typeof item !== "string" && "label" in item && item.label) {
    return item.label;
  }

  if (typeof item === "string" || "slug" in item) {
    const slug = resolveSlug(item);

    const file = await getFileBySlug(slug, contentDir);
    if (!file) {
      throw new PrestigeError(
        `markdown file not found with slug: ${slug} add one in content folder or update config`,
      );
    }
    const data = (await compileFrontmatter(file)) as any;
    if (data?.label) {
      return data?.label;
    }

    return basename(slug);
  }

  // is a group
  if (typeof item !== "string" && ("items" in item || "autogenerate" in item)) {
    return item.label;
  }

  return "";
}

/** @visibleForTesting */
export function resolveSlug(item: CollectionItem) {
  if (typeof item === "string") {
    return item;
  } else {
    if ("slug" in item) {
      return item.slug;
    }
    return "";
  }
}

/** @visibleForTesting */
export function resolveLink(item: CollectionItem) {
  if (typeof item === "object" && "link" in item) {
    return item.link;
  }
  return "";
}
