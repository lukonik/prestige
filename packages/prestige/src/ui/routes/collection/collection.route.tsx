import { AnyRoute, createRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../../components/sidebar/sidebar";
import MobileSidebar from "./mobile-sidebar";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRoutes: AnyRoute[] = [];
  for (const slug in sidebars) {
    const collectionRouter = createRoute({
      getParentRoute: () => root,
      path: `/${slug}`,
      beforeLoad: async ({ location }) => {
        const loader = sidebars[slug];

        if (!loader) {
          throw notFound();
        }

        const sidebar = await loader();

        if (!sidebar) {
          throw notFound();
        }

        if (location.pathname === "/" + slug) {
          if (sidebar.defaultLink) {
            throw redirect({
              to: "/" + sidebar.defaultLink,
            });
          }
        }
        return { sidebar };
      },
      component: CollectionComponent,
    });
    collectionRoutes.push(collectionRouter);
    function CollectionComponent() {
      const { sidebar } = collectionRouter.useRouteContext();

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
  }

  return collectionRoutes;
}
