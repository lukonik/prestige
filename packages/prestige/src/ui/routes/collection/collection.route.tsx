import { Outlet, ParsedLocation, redirect } from "@tanstack/react-router";
import { SidebarType } from "../../../vite/core/content/content.types";
import MobileSidebar from "./mobile-sidebar";
import Sidebar from "./sidebar";

export function CollectionRoute(sidebar: SidebarType, id: string) {
  return {
    loader: ({ location }: { location: ParsedLocation }) => {
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
        <div>
          <MobileSidebar sidebar={sidebar} />
          <div className="flex gap-4">
            <div className="hidden lg:block">
              {sidebar && <Sidebar sidebar={sidebar} />}
            </div>
            <div className="flex-1 pt-10 pb-20 lg:py-15 container  max-w-[100ch] px-4 lg:ml-80">
              <Outlet />
            </div>
          </div>
        </div>
      );
    },
  };
}
