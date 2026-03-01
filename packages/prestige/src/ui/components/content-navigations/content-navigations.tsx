import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationLink {
  label: string;
  slug: string;
}

function ContentNavigation({
  isNext,
  navigation,
}: {
  isNext?: boolean;
  navigation: NavigationLink;
}) {
  const label = isNext ? "Next" : "Previous";
  return (
    <Link
      to={navigation.slug}
      className={clsx(
        " flex-1 h-20 shadow-md border border-default rounded-md cursor-pointer hover:border-gray-400 flex items-center px-4",
        isNext ? "justify-end" : "justify-start",
      )}
    >
      <div className={clsx("flex items-center gap-2", isNext && "flex-row-reverse")}>
        {isNext ? <ArrowRight /> : <ArrowLeft />}
        <div className={clsx("flex flex-col", isNext && "items-end")}>
          <span className="font-light text-sm">{label}</span>
          <span className="text-2xl">{navigation.label}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ContentNavigations({
  prev,
  next,
}: {
  prev: NavigationLink | null;
  next: NavigationLink | null;
}) {
  return (
    <div className="flex items-center gap-2 mt-20 ">
      {prev && <ContentNavigation navigation={prev} />}
      {next && <ContentNavigation navigation={next} isNext />}
    </div>
  );
}
