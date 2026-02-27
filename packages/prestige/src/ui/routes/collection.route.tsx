import { AnyRoute, createRoute, notFound, Outlet } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../components/sidebar/sidebar";
import { SidebarType } from "../../vite/core/content/content.types";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRouter = createRoute({
    getParentRoute: () => root,
    path: "$slug",
    loader: async ({ params }) => {
      const slug = params.slug;
      const sidebar = sidebars[slug];
      if (sidebar) {
        const result = await sidebar();
        return result;
      }
      throw notFound();
    },
    component: CollectionComponent,
  });

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

  return collectionRouter;
}
