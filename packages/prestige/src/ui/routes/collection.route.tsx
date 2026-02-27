import { AnyRoute, createRoute, notFound, Outlet } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../components/sidebar/sidebar";
import { SidebarType } from "../../vite/core/content/content.types";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRoutes: AnyRoute[] = [];
  for (const slug in sidebars) {
    const collectionRouter = createRoute({
      getParentRoute: () => root,
      beforeLoad: async ({ routeId }) => {
        const sidebar = sidebars[routeId];
        if (sidebar) {
          const result = await sidebar();
          return result;
        }
      },
      path: `/${slug}`,
      loader: async ({ route }) => {
        const slug = route.path.replace("/", "");
        const sidebar = sidebars[slug];
        if (sidebar) {
          const result = await sidebar();
          return result;
        }
        throw notFound();
      },
      component: CollectionComponent,
    });
    collectionRoutes.push(collectionRouter);
    function CollectionComponent() {
      const data = collectionRouter.useLoaderData() as SidebarType;
      return (
        <div className="flex gap-4">
          {data && <Sidebar sidebar={data} />}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      );
    }
  }

  return collectionRoutes;
}
