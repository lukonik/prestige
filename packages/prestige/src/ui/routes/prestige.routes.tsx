import { AnyRoute } from "@tanstack/react-router";
import createCollectionRoute from "./collection.route";
import createContentRoute from "./content.route";
export function prestigeRoutes(root: AnyRoute) {
  const childrenRoutes = root.children || [];
  const collectionRoutes = createCollectionRoute(root);

  for (const collectionRoute of collectionRoutes) {
    const contentRoute = createContentRoute(collectionRoute);
    collectionRoute.addChildren([contentRoute]);
  }

  const allProposed = [...childrenRoutes, ...collectionRoutes];

  // Filter out duplicates by checking the path
  const uniqueChildren = allProposed.filter(
    (route, index, self) => index === self.findIndex((r) => r.options.path === route.options.path),
  );

  root.addChildren(uniqueChildren);
  return root;
}
