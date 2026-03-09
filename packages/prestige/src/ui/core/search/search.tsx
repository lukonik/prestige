import "@docsearch/css";
import { DocSearch } from "@docsearch/react";
import { AlgoliaOptions } from "../../routes/prestige-root-route";

export function Search({ algolia }: { algolia: AlgoliaOptions | undefined }) {
  if (!algolia) {
    return null;
  }

  return (
    <div className="prestige-search">
      <DocSearch
        appId={algolia.appId}
        apiKey={algolia.apiKey}
        indices={algolia.indices}
      />
    </div>
  );
}
