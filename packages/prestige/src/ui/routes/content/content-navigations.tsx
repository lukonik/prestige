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
      to={"/" + navigation.slug}
      className={clsx(
        " flex-1 h-20 mb-4 border border-gray-200 hover:bg-gray-50 rounded-md cursor-pointer flex items-center px-4",
        isNext ? "justify-end" : "justify-start",
      )}
    >
      <div className={clsx("flex items-center gap-4", isNext && "flex-row-reverse")}>
        {isNext ? <ArrowRight className="text-gray-400"/> : <ArrowLeft className="text-gray-400" />}
        <div className={clsx("flex flex-col", isNext && "items-end")}>
          <span className="text-xs tracking-widest font-mono">{label.toLocaleUpperCase()}</span>
          <span className="text-2xl font-li text-text-strong">{navigation.label}</span>
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
    <div className="lg:flex flex-row  items-center gap-2 mt-20 ">
      {prev && <ContentNavigation navigation={prev} />}
      {next && <ContentNavigation navigation={next} isNext />}
    </div>
  );
}
