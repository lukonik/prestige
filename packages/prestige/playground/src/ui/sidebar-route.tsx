import { Link, Outlet, RootRoute, createRoute } from "@tanstack/react-router";
import sidebars from "virtual:content-collection/sidebars";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$slug",
    loader: async ({ params }) => {
      const slug = params.slug;
      const sidebar = sidebars[slug];

      return sidebar;
    },
    component: () => {
      const data = contentRouter.useLoaderData() as any;
      return (
        <div>
          {data.items.map((i: any) => (
            <Link to={"/" + i.slug}>{i.slug}</Link>
          ))}
          <Outlet />
        </div>
      );
    },
  });
  return contentRouter;
}
