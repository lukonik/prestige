import { AnyRoute, createRoute, notFound, Outlet } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../../components/sidebar/sidebar";
import MobileSidebar from "./mobile-sidebar";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRoutes: AnyRoute[] = [];
  for (const slug in sidebars) {
    const collectionRouter = createRoute({
      getParentRoute: () => root,
      path: `/${slug}`,
      loader: async () => {
        const sidebar = sidebars[slug];
        if (sidebar) {
          const result = await sidebar();
          return { sidebar: result };
        }
        throw notFound();
      },
      component: CollectionComponent,
    });
    collectionRoutes.push(collectionRouter);
    function CollectionComponent() {
      const { sidebar } = collectionRouter.useLoaderData();

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
