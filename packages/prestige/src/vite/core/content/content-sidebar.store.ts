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
import { basename } from "node:path";
import logger from "../../utils/logger";
import { pathExists } from "../../utils/file-utils";
import { genObjectFromValues } from "knitwork";
import { genExportDefault, genExportUndefined } from "../../utils/code-generation";

export class ContentSidebarStore {
  private _store = new Map<string, Sidebar>();
  private _fileExtRegex = /\.mdx?$/i;
  private _virtualId = "virtual:content-collection/sidebar/";

  constructor(private contentDir: string) {}

  resolve(id: string) {
    if (id.includes(this._virtualId)) {
      return "\0" + id;
    }
    return null;
  }

  load(id: string) {
    if (id.includes("\0" + this._virtualId)) {
      const parts = this._virtualId.split("/");
      const result = parts[parts.length - 1];
      if (!result) {
        return genExportUndefined();
      }
      const collection = this._store.get(result);
      if (!collection) {
        return genExportUndefined();
      }
      return genExportDefault(genObjectFromValues(collection));
    }

    return null;
  }

  async init(collections: Collections) {
    for (const collection of collections) {
      const sidebar = await this.processCollection(collection);
      this._store.set(collection.id, sidebar);
    }
  }
  /** @visibleForTesting */
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

    if (group.items?.length && group.autogenerate) {
      logger.warn(`${group.label} has both items and autogenerate. Only items will be used.`);
    }

    if (group.items) {
      for (const childItem of group.items) {
        items.push(await this.processItem(childItem));
      }
    } else if (group.autogenerate?.directory) {
      const generatedItems = await this.autogenerateSidebar(group.autogenerate.directory);
      items.push(...generatedItems);
    }

    return {
      label,
      collapsible: group.collapsible,
      items,
    };
  }

  /** @visibleForTesting */
  async autogenerateSidebar(directory: string): Promise<SidebarItem[]> {
    const items: SidebarItem[] = [];
    const dirPath = join(this.contentDir, directory);
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
        items.push(await this.resolveSidebarGroup(group));
      } else if (dirent.isFile() && this._fileExtRegex.test(dirent.name)) {
        const fullPath = join(directory, dirent.name);
        const slug = fullPath.replace(this._fileExtRegex, "");
        items.push(await this.resolveSidebarLink(slug));
      }
    }
    return items;
  }

  /** @visibleForTesting */
  async resolveSidebarLink(item: CollectionLink): Promise<SidebarLink> {
    const label = await this.resolveLabel(item);
    const slug = this.resolveSlug(item);
    return {
      label,
      slug,
    };
  }

  /** @visibleForTesting */
  async resolveLabel(item: CollectionItem): Promise<string> {
    if (typeof item !== "string" && "label" in item && item.label) {
      return item.label;
    }

    if (typeof item === "string" || "slug" in item) {
      const slug = this.resolveSlug(item);

      const filePath = join(this.contentDir, `${slug}.md`);
      const fileContent = await readFile(filePath, "utf-8");
      const metadata = await parseMetadata(fileContent);
      if (metadata && metadata.label) {
        return metadata.label;
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
  resolveSlug(item: CollectionItem) {
    if (typeof item === "string") {
      return item;
    } else {
      if ("slug" in item) {
        return item.slug;
      }
      return "";
    }
  }
}
