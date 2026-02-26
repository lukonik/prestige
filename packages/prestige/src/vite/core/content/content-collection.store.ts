import { genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { Collection, Collections } from "./content.types";
import { PrestigeError } from "../../utils/errors";

export class ContentCollectionStore {
  private _collections = new Map<string, Collection>();
  private _virtualId = "virtual:prestige/collection-all";
  init(collections: Collections) {
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
      if (this._collections.size === 0) {
        throw new PrestigeError(`No collections found, add one in prestige plugin config`);
      }
      const obj = Object.fromEntries(this._collections);
      return genExportDefault(genObjectFromValues(obj));
    }
    return null;
  }
}
