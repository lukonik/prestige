import { AnyRoute, createRoute, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import sidebars from "virtual:prestige/sidebar-all";
import Sidebar from "../components/sidebar/sidebar";
import {
  SidebarType,
  SidebarItemType,
  SidebarLinkType,
  SidebarGroupType,
} from "../../vite/core/content/content.types";
import ContentNavigations from "../components/content-navigations/content-navigations";

export default function createCollectionRoute(root: AnyRoute) {
  const collectionRoutes: AnyRoute[] = [];
  for (const slug in sidebars) {
    const collectionRouter = createRoute({
      getParentRoute: () => root,
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
      const { pathname } = useLocation();

      const flattenLinks = useMemo(() => {
        if (!data) return [];
        const flatten = (items: SidebarItemType[]): SidebarLinkType[] => {
          return items.reduce((acc: SidebarLinkType[], item) => {
            if ("slug" in item) {
              acc.push({
                ...item,
                slug: item.slug.startsWith("/") ? item.slug : `/${item.slug}`,
              });
            } else if ("items" in item) {
              acc.push(...flatten((item as SidebarGroupType).items));
            }
            return acc;
          }, []);
        };
        return flatten(data.items);
      }, [data]);

      const currentIndex = flattenLinks.findIndex((link) => link.slug === pathname);
      const prev = currentIndex > 0 ? (flattenLinks[currentIndex - 1] ?? null) : null;
      const next =
        currentIndex !== -1 && currentIndex < flattenLinks.length - 1
          ? (flattenLinks[currentIndex + 1] ?? null)
          : null;

      return (
        <div className="flex gap-4">
          {data && <Sidebar sidebar={data} />}
          <div className="flex-1 py-10 container max-w-[75ch] ml-80">
            <Outlet />
            <ContentNavigations prev={prev} next={next} />
          </div>
        </div>
      );
    }
  }

  return collectionRoutes;
}
