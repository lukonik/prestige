import { readFile } from "node:fs/promises";
import { parseContent } from "./content-parser";
import { join } from "pathe";
import { genExportDefault, genExportUndefined } from "../../utils/code-generation";
import { genArrayFromRaw, genDynamicImport, genObjectFromRaw, genString } from "knitwork";
import { CollectionItem, CollectionLink, Collections } from "./content.types";

export class ContentStore {
  private _store = new Map<string, CollectionLink>();
  private _virtualId = "virtual:content-collection/content";
  private _virtualIdAll = "virtual:content-collection/content-all";

  constructor(private contentDir: string) {}

  private getKey(id: string) {
    return id.replace(this._virtualId, "").replace("\0", "");
  }

  async build(collections: Collections) {
    // Clear existing entries if you plan on calling this multiple times
    this._store.clear();

    const processItem = (item: CollectionItem) => {
      // Type guard: If it has a 'slug', it's a CollectionLink
      if ("slug" in item) {
        this._store.set(item.slug, item);
      }
      // Type guard: If it has 'items', it's a CollectionGroup
      else if ("items" in item) {
        item.items.forEach(processItem);
      }
    };

    collections.forEach((collection) => {
      collection.items.forEach(processItem);
    });
  }

  resolve(id: string) {
    if (id === this._virtualIdAll) {
      return "\0" + this._virtualIdAll;
    }
    if (id.includes(this._virtualId)) {
      const key = this.getKey(id).slice(1);
      const item = this._store.get(key);

      if (item) {
        return `\0${this._virtualId}/${key}`;
      }
    }
    return null;
  }

  async load(id: string) {
    // this is for all content
    if (id === "\0" + this._virtualIdAll) {
      const records = [];
      for (const [key] of this._store.entries()) {
        records.push(
          genObjectFromRaw({
            slug: genString(key),
            load: genDynamicImport(`${this._virtualId}/${key}`), // Output: () => import('virtual/my-slug')
          }),
        );
      }
      return genExportDefault(genArrayFromRaw(records));
    }

    if (id.includes(this._virtualId)) {
      const key = this.getKey(id).slice(1);
      const item = this._store.get(key);

      if (!item) {
        return null;
      }

      const slug = item.slug;
      const path = join(this.contentDir, slug) + ".md";
      const content = await getContentByPath(path);
      if (!content) {
        return genExportUndefined();
      }
      const code = genExportDefault(JSON.stringify(content));
      return code;
    }

    return null;
  }
}

export async function getContentByPath(path: string) {
  try {
    const file = await readFile(path, "utf-8");
    const article = parseContent(file);
    return article;
  } catch {
    return;
  }
}
