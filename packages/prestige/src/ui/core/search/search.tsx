import "@docsearch/css";
import { DocSearch } from "@docsearch/react";
import { AlgoliaOptions } from "../../routes/prestige-shell";

export function Search({
  algolia,
}: {
  // 2. Add 'typeof' to extract the type from the value
  algolia: AlgoliaOptions | undefined;
}) {
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
