import { genArrayFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { CollectionNavigation, Collections, SidebarType } from "./content.types";
import { PrestigeError } from "../../utils/errors";

export class ContentCollectionStore {
  private _collections = new Array<CollectionNavigation>();
  private _virtualId = "virtual:prestige/collection-all";

  init(collections: Collections, sidebars: Map<string, SidebarType>) {
    for (const collection of collections) {
      let defaultLink = collection.defaultLink;

      if (!defaultLink) {
        const sidebar = sidebars.get(collection.id);
        if (sidebar && sidebar.items.length > 0) {
          const firstItem = sidebar.items[0];
          if (firstItem && "slug" in firstItem) {
            defaultLink = firstItem.slug;
          } else if (firstItem && "items" in firstItem && firstItem.items.length > 0) {
            const firstGroupLink = firstItem.items[0];
            if (firstGroupLink && "slug" in firstGroupLink) {
              defaultLink = firstGroupLink.slug;
            }
          }
        }
      }

      this._collections.push({
        id: collection.id,
        label: collection.label ?? collection.id,
        ...(defaultLink ? { defaultLink } : {}),
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
