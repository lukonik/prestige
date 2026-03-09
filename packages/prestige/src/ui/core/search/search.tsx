import "@docsearch/css";
import { DocSearch } from "@docsearch/react";
import config from "virtual:prestige/config";

export function Search({
  algolia,
}: {
  // 2. Add 'typeof' to extract the type from the value
  algolia: (typeof config)["algolia"] | undefined;
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
