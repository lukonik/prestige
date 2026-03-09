import { Link } from "@tanstack/react-router";
import collections from "virtual:prestige/collection-all";
import { PrestigeRootRouteOptions } from "../../routes/prestige-root-route";
import { GitHub } from "../github/github";
import { Search } from "../search/search";
import { Theme } from "../theme/theme";

export type HeaderProps = Pick<
  PrestigeRootRouteOptions,
  "algolia" | "title" | "customHeaderTitle" | "github"
>;

export default function Header({
  algolia,
  title,
  github,
  customHeaderTitle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-header  border-b border-default-200 bg-default-50/80 px-4 backdrop-blur-md">
      <div className="container mx-auto flex max-w-360  items-center justify-between">
        <div className="flex gap-4 items-baseline">
          <Link
            className="text-sm rounded hover:bg-default-100 text-default-500"
            to={"/"}
          >
            {customHeaderTitle ? customHeaderTitle() : <span>{title}</span>}
          </Link>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/${collection.id}` as any}
              className="border-b-transparent border-b-2 text-default-500 text-sm  rounded hover:bg-default-100 active:bg-default-200 capitalize"
              activeProps={{ className: "text-default-800 font-medium" }}
            >
              {collection.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Search algolia={algolia} />
          <GitHub github={github} />
          <Theme />
        </div>
      </div>
    </header>
  );
}
