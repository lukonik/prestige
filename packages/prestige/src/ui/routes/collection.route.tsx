import { AnyRoute, createRoute, notFound, Outlet } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../components/sidebar/sidebar";

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
        <div className="flex gap-4">
          {sidebar && <Sidebar sidebar={sidebar} />}
          <div className="flex-1 py-10 container max-w-[75ch] ml-80">
            <Outlet />
          </div>
        </div>
      );
    }
  }

  return collectionRoutes;
}
