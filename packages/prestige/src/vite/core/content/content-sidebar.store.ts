import { readFile, readdir } from "node:fs/promises";
import { join } from "pathe";
import { parseMetadata } from "./content-parser";
import {
  Collection,
  CollectionGroup,
  CollectionItem,
  CollectionLink,
  Collections,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SidebarLink,
} from "./content.types";
import logger from "../../utils/logger";

export class ContentSidebarStore {
  private _store = new Map<string, Sidebar>();

  constructor(private contentDir: string) {}

  async init(collections: Collections) {
    for (const collection of collections) {
      const sidebar = await this.processCollection(collection);
      this._store.set(collection.id, sidebar);
    }
  }

  async processCollection(collection: Collection): Promise<Sidebar> {
    const items: SidebarItem[] = [];
    for (const item of collection.items) {
      items.push(await this.processItem(item));
    }
    return { items };
  }

  /** @visibleForTesting */
  async processItem(item: CollectionItem): Promise<SidebarItem> {
    if (typeof item === "string" || "slug" in item) {
      return this.resolveSidebarLink(item as CollectionLink);
    } else {
      return this.resolveSidebarGroup(item as CollectionGroup);
    }
  }

  /** @visibleForTesting */
  async resolveSidebarGroup(group: CollectionGroup): Promise<SidebarGroup> {
    const label = await this.resolveLabel(group);
    const items: SidebarItem[] = [];

    if (group.items) {
      for (const childItem of group.items) {
        items.push(await this.processItem(childItem));
      }
    }

    if (group.autogenerate?.directory) {
      const generatedItems = await this.autogenerateSidebar(
        group.autogenerate.directory,
      );
      items.push(...generatedItems);
    }

    return {
      label,
      items,
    };
  }

  /** @visibleForTesting */
  async autogenerateSidebar(directory: string): Promise<SidebarItem[]> {
    const items: SidebarItem[] = [];
    const dirPath = join(this.contentDir, directory);

    try {
      const dirents = await readdir(dirPath, { withFileTypes: true });
      dirents.sort((a, b) => a.name.localeCompare(b.name));

      for (const dirent of dirents) {
        if (dirent.isDirectory()) {
          const subDir = join(directory, dirent.name);
          const group: CollectionGroup = {
            label: dirent.name,
            autogenerate: { directory: subDir },
          };
          items.push(await this.resolveSidebarGroup(group));
        } else if (dirent.isFile() && dirent.name.endsWith(".md")) {
          const slug = join(directory, dirent.name.replace(/\.md$/, ""));
          items.push(await this.resolveSidebarLink(slug));
        }
      }
    } catch (e) {
      logger.warn(`Failed to autogenerate sidebar for directory: ${directory}`);
    }

    return items;
  }

  /** @visibleForTesting */
  async resolveSidebarLink(item: CollectionLink): Promise<SidebarLink> {
    const label = await this.resolveLabel(item);
    if (typeof item === "string") {
      return {
        slug: item,
        label,
      };
    } else {
      return {
        slug: item.slug,
        label,
      };
    }
  }

  /** @visibleForTesting */
  async resolveLabel(item: CollectionItem): Promise<string> {
    if (typeof item !== "string" && "label" in item && item.label) {
      return item.label;
    }

    if (typeof item === "string" || "slug" in item) {
      const slug = typeof item === "string" ? item : item.slug;

      try {
        const filePath = join(this.contentDir, `${slug}.md`);
        const fileContent = await readFile(filePath, "utf-8");
        const metadata = await parseMetadata(fileContent);
        if (metadata && metadata.label) {
          return metadata.label;
        }
      } catch {
        logger.warn(
          `No label found for ${slug}, setting empty label '', provide one`,
        );
        return "";
        // Fallback if file read/parse fails
      }

      // Fallback to markdown file name from the slug
      const parts = slug.split("/");
      return parts[parts.length - 1] ?? "";
    }

    // is a group
    if (
      typeof item !== "string" &&
      ("items" in item || "autogenerate" in item)
    ) {
      return item.label;
    }

    return "";
  }
}
