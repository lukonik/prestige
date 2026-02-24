import { AnyRoute, createRoute, Link, Outlet } from "@tanstack/react-router";
import sidebars from "virtual:content-collection/sidebars";
import contents from "virtual:content-collection/content-all";

export function prestigeRoutes(root: AnyRoute) {
  const collectionRouter = createRoute({
    getParentRoute: () => root,
    path: "$slug",
    loader: async ({ params }) => {
      const slug = params.slug;
      const sidebar = sidebars[slug];
      if (!sidebar) {
        throw new Error("Sidebar not found");
      }
      return sidebar;
    },
    component: CollectionComponent,
  });

  function CollectionComponent() {
    const data = collectionRouter.useLoaderData();
    return (
      <div>
        {JSON.stringify(data.items)}
        {data.items.map((i: any) => (
          <Link to={i.slug}>{i.slug}</Link>
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
      const fullPath = [anyParams["slug"], anyParams["_splat"]]
        .filter(Boolean)
        .join("/");

      if (fullPath) {
        const content = contents.find((c: any) => c.slug === fullPath);
        if (content) {
          const { default: response } = await content.load();
          return response;
        }
      }
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
