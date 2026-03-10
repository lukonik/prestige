import { genArrayFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { PrestigeError } from "../../utils/errors";
import {
  CollectionNavigation,
  Collections,
  SidebarLinkType,
} from "./content.types";

export const COLLECTION_VIRTUAL_ID = "virtual:prestige/collection-all";

export function resolveCollectionNavigations(
  inlineCollections: Collections,
  linksMap: Map<string, SidebarLinkType[]>,
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

  const validCollections = collections.filter((c) => c.defaultLink);

  return genExportDefault(
    genArrayFromRaw(validCollections.map((c) => genObjectFromValues(c))),
  );
}
