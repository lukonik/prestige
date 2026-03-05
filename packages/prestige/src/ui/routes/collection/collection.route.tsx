import { AnyRoute, createRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../../components/sidebar/sidebar";
import MobileSidebar from "./mobile-sidebar";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRoutes: AnyRoute[] = [];
  const collectionRouter = createRoute({
    getParentRoute: () => root,
    id: "collection",
    beforeLoad: async ({ params }) => {
      const splat = params["_splat"] as string;
      if (!splat) {
        throw notFound();
      }

      const slugArray = splat.split("/");

      // if there is no slash, it is not content link
      if (slugArray.length === 0) {
        throw notFound();
      }

      // first slug is collection slug

      const collectionSlug = slugArray[0];
      if (!collectionSlug) {
        throw notFound();
      }
      const loader = sidebars[collectionSlug];
      if (!loader) {
        throw notFound();
      }
      const sidebar = await loader();

      // if there is only one slug then it is collection page
      // without content so we redirect to defaultLink
      if (slugArray.length === 1) {
        if (!sidebar || !sidebar.defaultLink) {
          throw notFound();
        }

        throw redirect({
          to: "/" + sidebar.defaultLink,
        });
      }
      // more slugs means content page
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

  return collectionRoutes;
}
