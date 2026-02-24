import { genExportDefault } from "../../utils/code-generation";
import { Sidebars, SidebarItem } from "./content-sidebar-types";
import { SidebarGenerator } from "./sidebar-generator";
import { genString, genDynamicImport, genObjectFromRaw } from "knitwork";
/**
 * Content collection orchestrates to build content hierarchy
 */
export class ContentCollection {
  private _sidebarRecords = new Map<string, SidebarGenerator>();
  private _virtualId = "virtual:content-collection";
  private _resolveVirtualId = "\0" + this._virtualId;

  private _sidebarLinks = new Map<string, string>();

  constructor(private contentPath: string) {}

  public generateFlatList(sidebars: Sidebars): void {
    // Clear existing entries if you plan on calling this multiple times
    this._sidebarLinks.clear();

    const processItem = (item: SidebarItem) => {
      // Type guard: If it has a 'slug', it's a SidebarLink
      if ("slug" in item) {
        this._sidebarLinks.set(item.slug, item.label);
      }
      // Type guard: If it has 'items', it's a SidebarGroup
      else if ("items" in item) {
        item.items.forEach(processItem);
      }
    };

    sidebars.forEach((sidebar) => {
      sidebar.items.forEach(processItem);
    });
  }

  async build(sidebars: Sidebars) {
    this.generateFlatList(sidebars);

    for (const sidebar of sidebars) {
      const generator = new SidebarGenerator(sidebar.id, this.contentPath);
      await generator.buildMap();
      this._sidebarRecords.set(sidebar.id, generator);
    }
  }

  resolve(id: string) {
    if (id === this._virtualId) {
      return this._resolveVirtualId;
    }

    if (id.startsWith(this._virtualId + "/")) {
      return `\0${id}`;
    }

    return null;
  }

  load(id: string) {
    if (this._resolveVirtualId === id) {
      const records = [];

      for (const [key] of this._sidebarRecords.entries()) {
        records.push(
          genObjectFromRaw({
            slug: genString(key), // Output: 'my-slug'
            load: `() => ${genDynamicImport(`${this._virtualId}/${key}`)}`, // Output: () => import('virtual/my-slug')
          }),
        );
      }

      return genExportDefault("2");
    }

    if (id.includes(this._resolveVirtualId + "/")) {
      const key = id.replace(this._resolveVirtualId + "/", "");

      const sidebar = this._sidebarRecords.get(key);

      if (sidebar) {
        const code = sidebar.getAll();
        return code;
      }

      // Assuming we need to return the sidebar here. Let me check what it should return.
    }

    return null;
  }
}
