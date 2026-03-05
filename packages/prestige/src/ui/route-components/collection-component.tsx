import { Outlet, ParsedLocation, redirect } from "@tanstack/react-router";
import { SidebarType } from "../../vite/core/content/content.types";
import MobileSidebar from "../routes/collection/mobile-sidebar";
import Sidebar from "../components/sidebar/sidebar";

export function CollectionComponent({ sidebar }: { sidebar: SidebarType }) {
  return (
    <div>
      <MobileSidebar sidebar={sidebar} />
      <div className="flex gap-4">
        <div className="hidden lg:block">{sidebar && <Sidebar sidebar={sidebar} />}</div>
        <div className="flex-1 pt-10 pb-20 lg:py-15 container  max-w-[100ch] px-4 lg:ml-80">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function collectionLoader(location: ParsedLocation, sidebar: SidebarType, id: string) {
  if (id === location.pathname.slice(1)) {
    if (sidebar.defaultLink) {
      throw redirect({
        to: "/" + sidebar.defaultLink,
      });
    }
  }
}
