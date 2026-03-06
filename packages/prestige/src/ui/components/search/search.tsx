import "@docsearch/css";
import { DocSearch } from "@docsearch/react";
import config from "virtual:prestige/config";

export function Search() {
  if (!config.algolia) {
    return null;
  }

  return (
    <div className="prestige-search">
      <DocSearch
        appId={config.algolia.appId}
        apiKey={config.algolia.apiKey}
        indices={[config.algolia.indexName]}
      />
    </div>
  );
}
