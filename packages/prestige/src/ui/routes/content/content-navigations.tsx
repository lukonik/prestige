import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiblingNavigationType } from "../../../vite/core/content/content.types";

function ContentNavigation({
  isNext,
  navigation,
}: {
  isNext?: boolean;
  navigation: SiblingNavigationType;
}) {
  const label = isNext ? "Next" : "Previous";
  return (
    <Link
      to={navigation.link}
      className={clsx(
        " flex-1 h-20 mb-4 border border-default-200 hover:bg-default-50 rounded-md cursor-pointer flex items-center px-4",
        isNext ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-4",
          isNext && "flex-row-reverse",
        )}
      >
        {isNext ? (
          <ArrowRight className="text-default-400" />
        ) : (
          <ArrowLeft className="text-default-400" />
        )}
        <div className={clsx("flex flex-col", isNext && "items-end")}>
          <span className="text-xs tracking-widest font-mono">
            {label.toLocaleUpperCase()}
          </span>
          <span className="text-2xl font-li text-default-700">
            {navigation.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ContentNavigations({
  prev,
  next,
}: {
  prev: SiblingNavigationType | null | undefined;
  next: SiblingNavigationType | null | undefined;
}) {
  if (!prev && !next) return null;
  // width of content navigation must match with content route content width, so we manually
  // add empty div with table-of-content width and add proper gap to match the size
  return (
    <div className="flex gap-6">
      <div className="lg:flex flex-row items-center gap-2 mt-2 lg:mt-8 flex-1">
        {prev && <ContentNavigation navigation={prev} />}
        {next && <ContentNavigation navigation={next} isNext />}
      </div>
      <div className="lg:w-web-table-of-content h-1"></div>
    </div>
  );
}
