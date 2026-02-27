import { Link } from "@tanstack/react-router";
import collections from "virtual:prestige/collection-all";
export default function Header() {
  return (
    <header className="flex border-b border-gray-200 h-14 items-center px-4">
      <div className="flex gap-2">
        <Link to={"/"}>Home</Link>
        {collections.map((collection) => (
          <Link key={collection.id} to={`/` + collection.id}>
            {collection.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
