import { Link, useLocation } from "@tanstack/react-router";
import collections from "virtual:prestige/collection-all";
import config from "virtual:prestige/config";
import type {
  AlgoliaOptions,
  PrestigeHeaderLink,
  PrestigeShellProps,
} from "../../routes/prestige-shell";
import { GitHub } from "../github/github";
import { Search } from "../search/search";
import { Theme } from "../theme/theme";

const headerLinkClassName =
  "border-b-2 text-sm rounded hover:bg-default-100 active:bg-default-200 capitalize";
const headerLinkInactiveClassName = "border-b-transparent text-default-500";
const headerLinkActiveClassName =
  "border-default-800 text-default-800 font-medium";

export type HeaderProps = Pick<
  PrestigeShellProps,
  "customHeaderTitle" | "beforeHeaderLinks" | "afterHeaderLinks"
> & { algolia: AlgoliaOptions | undefined; github: string | undefined };

export default function Header({
  customHeaderTitle,
  algolia,
  github,
  beforeHeaderLinks,
  afterHeaderLinks,
}: HeaderProps) {
  const location = useLocation();

  const isHeaderLinkActive = (to: string) => {
    const path = to.split(/[?#]/)[0];

    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(`${path}/`))
    );
  };

  const renderHeaderLinks = (links: PrestigeHeaderLink[] | undefined) =>
    links?.map((link, index) => {
      const isActive = isHeaderLinkActive(link.to);

      return (
        <Link
          key={`${link.to}-${index}`}
          to={link.to as any}
          className={`${headerLinkClassName} ${
            isActive ? headerLinkActiveClassName : headerLinkInactiveClassName
          }`}
        >
          {link.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-40 flex h-header  border-b border-default-200 bg-default-50/80 px-4 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link
            activeProps={{
              className: "border-default-800 text-default-800 font-medium",
            }}
            className="text-sm rounded hover:bg-default-100 text-default-500"
            to={"/"}
          >
            {customHeaderTitle ? (
              customHeaderTitle()
            ) : (
              <span>{config.title}</span>
            )}
          </Link>
          {renderHeaderLinks(beforeHeaderLinks)}
          {collections.map((collection) => {
            const isActive =
              location.pathname === `/${collection.id}` ||
              location.pathname.startsWith(`/${collection.id}/`);

            return (
              <Link
                key={collection.id}
                to={`/${collection.defaultLink}` as any}
                className={`${headerLinkClassName} ${
                  isActive
                    ? headerLinkActiveClassName
                    : headerLinkInactiveClassName
                }`}
              >
                {collection.label}
              </Link>
            );
          })}
          {renderHeaderLinks(afterHeaderLinks)}
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
