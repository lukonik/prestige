import { createRoute, RootRoute } from "@tanstack/react-router";
// Using contentRouter directly is safer than importing Route from generated files
import contents from "virtual:content-collection/content-all";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "$",
    loader: async ({ params }) => {
      // Cast params to access both the parent's 'slug' and this route's '_splat'
      const anyParams = params as Record<string, string | undefined>;

      // Reconstruct the full path (e.g., "docs/demo")
      const fullPath = [anyParams.slug, anyParams._splat]
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
  return contentRouter;
}
