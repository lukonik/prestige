import { genArrayFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault } from "../../utils/code-generation";
import { PrestigeError } from "../../utils/errors";
import { Collections } from "./content.types";

export const COLLECTION_VIRTUAL_ID = "virtual:prestige/collection-all";

export function resolveCollectionNavigations(inlineCollections: Collections) {
  const collections = inlineCollections.map((c) => ({
    id: c.id,
    label: c.label ?? c.id,
  }));
  if (collections.length === 0) {
    throw new PrestigeError(
      `No collections found, add one in prestige plugin config`,
    );
  }
  return genExportDefault(
    genArrayFromRaw(collections.map((c) => genObjectFromValues(c))),
  );
}
