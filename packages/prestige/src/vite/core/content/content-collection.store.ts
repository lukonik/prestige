import { genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { Collection, Collections } from "./content.types";

export class ContentCollectionStore {
  private _collections = new Map<string, Collection>();
  private _virtualId = "virtual:content-collection/all";
  build(collections: Collections) {
    for (const collection of collections) {
      this._collections.set(collection.id, collection);
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
      const obj = Object.fromEntries(this._collections);
      return genExportDefault(genObjectFromValues(obj));
    }
    return null;
  }
}
