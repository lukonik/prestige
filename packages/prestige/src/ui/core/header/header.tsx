import { Link, useLocation } from "@tanstack/react-router";
import collections from "virtual:prestige/collection-all";
import config from "virtual:prestige/config";
import { PrestigeShellProps } from "../../routes/prestige-shell";
import { GitHub } from "../github/github";
import { Search } from "../search/search";
import { Theme } from "../theme/theme";

export type HeaderProps = Pick<PrestigeShellProps, "customHeaderTitle">;

export default function Header({ customHeaderTitle }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 flex h-header  border-b border-default-200 bg-default-50/80 px-4 backdrop-blur-md">
      <div className="container mx-auto flex max-w-360  items-center justify-between">
        <div className="flex gap-4 items-baseline">
          <Link
            className="text-sm rounded hover:bg-default-100 text-default-500"
            to={"/"}
          >
            {customHeaderTitle ? (
              customHeaderTitle()
            ) : (
              <span>{config.title}</span>
            )}
          </Link>
          {collections
            .filter((c) => c.defaultLink)
            .map((collection) => {
              const isActive =
                location.pathname === `/${collection.id}` ||
                location.pathname.startsWith(`/${collection.id}/`);

              return (
                <Link
                  key={collection.id}
                  to={`/${collection.defaultLink}`}
                  className={`border-b-2 text-sm rounded hover:bg-default-100 active:bg-default-200 capitalize ${
                    isActive
                      ? "border-default-800 text-default-800 font-medium"
                      : "border-b-transparent text-default-500"
                  }`}
                >
                  {collection.label}
                </Link>
              );
            })}
        </div>
        <div className="flex items-center gap-2">
          <Search algolia={config.algolia} />
          <GitHub github={config.github} />
          <Theme />
        </div>
      </div>
    </header>
  );
}
