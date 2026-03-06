import { Link } from "@tanstack/react-router";
import collections from "virtual:prestige/collection-all";
import { Search } from "../search/search";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-header items-center justify-between border-b border-gray-200 bg-gray-50/80 px-4 backdrop-blur-md">
      <div className="flex gap-2">
        <Link to={"/"}>Home</Link>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/${collection.id}` as any}
            className="border-b-transparent border-b-2"
            activeProps={{
              style: { borderBottomColor: "var(--color-primary)" }, // style object is used to overide border transparent
            }}
          >
            {collection.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Search />
      </div>
    </header>
  );
}
