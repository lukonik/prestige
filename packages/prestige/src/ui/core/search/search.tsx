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
     <input type="text" />
    </div>
  );
}
