import { AnyRoute, createRoute, Link, Outlet } from "@tanstack/react-router";
import contents from "virtual:content-collection/content-all";
import sidebars from "virtual:content-collection/sidebar-all";
export function prestigeRoutes(root: AnyRoute) {
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
      return null;
    },
    component: CollectionComponent,
  });

  function CollectionComponent() {
    const data = collectionRouter.useLoaderData();
    return (
      <div>
        {JSON.stringify(data)}
        {data?.items.map((i: any) => (
          <Link key={i.slug} to={"/" + i.slug}>
            {i.slug}
          </Link>
        ))}
        <Outlet />
      </div>
    );
  }

  const contentRouter = createRoute({
    getParentRoute: () => collectionRouter,
    path: "$",
    loader: async ({ params }) => {
      // Cast params to access both the parent's 'slug' and this route's '_splat'
      const anyParams = params as Record<string, string | undefined>;

      // Reconstruct the full path (e.g., "docs/demo")
      const fullPath = [anyParams["slug"], anyParams["_splat"]].filter(Boolean).join("/");
      if (fullPath) {
        const content = contents[fullPath];
        if (content) {
          const response = await content();
          return response;
        }
      }
      return null;
    },
    component: () => {
      // Use the local contentRouter instance instead of the global Route
      const data = contentRouter.useLoaderData() as any;
      if (!data) return <div>Content not found</div>;

      return (
        <div
          dangerouslySetInnerHTML={{
            __html: data.html,
          }}
        ></div>
      );
    },
  });

  collectionRouter.addChildren([contentRouter]);
  root.addChildren([collectionRouter]);

  return root;
}
