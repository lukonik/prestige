import { readFile } from "node:fs/promises";
import { parseContent } from "./content-parser";
import { Sidebar, SidebarItem, SidebarLink } from "./content.types";
import { genDynamicImport, genObjectFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault, genExportUndefined } from "../../utils/code-generation";
import { join } from "node:path";

export class ContentStore {
  private _store = new Map<string, SidebarLink>();
  private _virtualId = "virtual:prestige/content/";
  private _virtualIdAll = "virtual:prestige/content-all";

  constructor(private contentDir: string) {}

  async init(sidebars: Map<string, Sidebar>) {
    const sidebarsArray = sidebars.values();
    for (const sidebar of sidebarsArray) {
      this._extractLinks(sidebar.items);
    }
  }

  private _extractLinks(items: SidebarItem[]) {
    for (const item of items) {
      if ("slug" in item) {
        this._store.set(item.slug, item);
      } else if ("items" in item) {
        this._extractLinks(item.items);
      }
    }
  }

  async resolve(id: string) {
    if (id === this._virtualIdAll) {
      return "\0" + this._virtualIdAll;
    }
    if (id.startsWith(this._virtualId)) {
      return "\0" + id;
    }
    return null;
  }

  async load(id: string) {
    if (id.includes("\0" + this._virtualIdAll)) {
      const records: Record<string, string> = {};
      for (const [key] of this._store.entries()) {
        records[key] = genDynamicImport(`virtual:prestige/content/${key}`, {
          interopDefault: true,
        });
      }
      return genExportDefault(genObjectFromRaw(records));
    }

    if (id.includes("\0" + this._virtualId)) {
      const pathPart = id.replace("\0" + this._virtualId, "");
      const fullPath = join(this.contentDir, pathPart) + ".md";
      const content = await getContentByPath(fullPath);
      if (!content) {
        return genExportUndefined();
      }
      return genExportDefault(genObjectFromValues(content));
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
