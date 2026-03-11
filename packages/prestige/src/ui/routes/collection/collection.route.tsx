import { Outlet, useLocation } from "@tanstack/react-router";
import { SidebarType } from "../../../vite/core/content/content.types";
import ContentNavigations from "../content/content-navigations";
import MobileSidebar from "./mobile-sidebar";
import Sidebar from "./sidebar";

export function CollectionRoute(sidebar: SidebarType, id: string) {
  return {
    component: () => {
      const location = useLocation();
      const navigation = sidebar?.navigation?.[location.pathname] || {
        prev: null,
        next: null,
      };
      const { prev, next } = navigation;

      return (
        <div className="mx-auto flex container lg:gap-6">
          <MobileSidebar sidebar={sidebar} />
          <div className="hidden lg:block">
            {sidebar && <Sidebar sidebar={sidebar} />}
          </div>
          <div className="flex-1 pb-20">
            <Outlet />
            <div className="mt-8 px-6 lg:px-0">
              <ContentNavigations prev={prev} next={next} />
            </div>
          </div>
        </div>
      );
    },
  };
}
