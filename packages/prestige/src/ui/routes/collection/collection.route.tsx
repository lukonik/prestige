import { Outlet, ParsedLocation, redirect } from "@tanstack/react-router";
import { SidebarType } from "../../../vite/core/content/content.types";
import MobileSidebar from "./mobile-sidebar";
import Sidebar from "./sidebar";

export function CollectionRoute(sidebar: SidebarType, id: string) {
  return {
    beforeLoad: ({ location }: { location: ParsedLocation }) => {
      if (id === location.pathname.slice(1)) {
        if (sidebar.defaultLink) {
          throw redirect({
            to: "/" + sidebar.defaultLink,
          });
        }
      }
    },
    component: () => {
      return (
        <div className="container mx-auto flex max-w-360 lg:gap-6 px-6">
          <MobileSidebar sidebar={sidebar} />
          <div className="hidden lg:block">
            {sidebar && <Sidebar sidebar={sidebar} />}
          </div>
          <div className="flex-1 pt-10 pb-20 lg:py-15 ">
            <Outlet />
          </div>
        </div>
      );
    },
  };
}
