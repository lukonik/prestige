import { genArrayFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { CollectionNavigation, Collections } from "./content.types";
import { PrestigeError } from "../../utils/errors";

export class ContentCollectionStore {
  private _collections = new Array<CollectionNavigation>();
  private _virtualId = "virtual:prestige/collection-all";
  init(collections: Collections) {
    for (const collection of collections) {
      this._collections.push({
        id: collection.id,
        label: collection.label ?? collection.id,
      });
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
      if (this._collections.length === 0) {
        throw new PrestigeError(`No collections found, add one in prestige plugin config`);
      }
      return genExportDefault(
        genArrayFromRaw(this._collections.map((c) => genObjectFromValues(c))),
      );
    }
    return null;
  }
}
