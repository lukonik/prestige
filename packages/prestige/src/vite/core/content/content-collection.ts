import { genExportDefault } from "../../utils/code-generation";
import { Sidebars } from "./content-sidebar-types";
import { SidebarGenerator } from "./sidebar-generator";
import {
  genString,
  genDynamicImport,
  genObjectFromRaw,
  genArrayFromRaw,
} from "knitwork";
/**
 * Content collection orchestrates to build content hierarchy
 */
export class ContentCollection {
  private _sidebarRecords = new Map<string, SidebarGenerator>();
  private _virtualId = "virtual:content-collection";
  private _resolveVirtualId = "\0" + this._virtualId;

  constructor(private contentPath: string) {}

  async build(sidebars: Sidebars) {
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

      // Combine standard string concatenation for the export with knitwork's array generator
      return genExportDefault(genArrayFromRaw(records));
    }

    if (id.includes(this._resolveVirtualId + "/")) {
      const key = id.replace(this._resolveVirtualId + "/", "");

      const sidebar = this._sidebarRecords.get(key);

      if (sidebar) {
        const code = sidebar.getAll();
        console.log("CODE ISS ", code);
        return code;
      }

      // Assuming we need to return the sidebar here. Let me check what it should return.
    }

    return null;
  }
}
