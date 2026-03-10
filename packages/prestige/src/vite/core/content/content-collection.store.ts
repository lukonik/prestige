import { genArrayFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { PrestigeError } from "../../utils/errors";
import {
  CollectionNavigation,
  Collections,
  InternalSidebarLinkType,
} from "./content.types";

export const COLLECTION_VIRTUAL_ID = "virtual:prestige/collection-all";

export function resolveCollectionNavigations(
  inlineCollections: Collections,
  linksMap: Map<string, InternalSidebarLinkType[]>,
) {
  const collections: CollectionNavigation[] = inlineCollections.map((c) => ({
    id: c.id,
    label: c.label ?? c.id,
    defaultLink: c.defaultLink ?? "",
  }));
  if (collections.length === 0) {
    throw new PrestigeError(
      `No collections found, add one in prestige plugin config`,
    );
  }

  for (const coll of collections) {
    const links = linksMap.get(coll.id);
    const firstLink = links?.[0];
    if (coll.defaultLink || !firstLink) {
      continue;
    }
    coll.defaultLink = firstLink.slug;
  }

  for (const coll of collections) {
    if (!coll.defaultLink) {
      console.warn(
        `No default link found for collection ${coll.id}, it won't be displayed in the header navigation`,
      );
    }
  }

  const validCollections = collections.filter((c) => c.defaultLink);

  return genExportDefault(
    genArrayFromRaw(validCollections.map((c) => genObjectFromValues(c))),
  );
}
