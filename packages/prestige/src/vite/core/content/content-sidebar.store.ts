import { genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { Sidebar, Sidebars } from "./content.types";

export class ContentSidebarStore {
  private _sidebars = new Map<string, Sidebar>();
  private _virtualId = "virtual:content-collection/sidebars";
  build(sidebars: Sidebars) {
    for (const sidebar of sidebars) {
      this._sidebars.set(sidebar.id, sidebar);
    }
  }

  resolve(id: string) {
    if (id === this._virtualId) {
      return "\0" + this._virtualId;
    }
    return null;
  }

  load(id: string) {
    if (id === "\0" + this._virtualId) {
      const obj = Object.fromEntries(this._sidebars);
      console.log("CAMEE ID ", obj);
      return genExportDefault(genObjectFromValues(obj));
    }
    return null;
  }
}
