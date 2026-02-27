import { AnyRoute } from "@tanstack/react-router";
import createCollectionRoute from "./collection.route";
import createContentRoute from "./content.route";
export function prestigeRoutes(root: AnyRoute) {
  const collectionRoutes = createCollectionRoute(root);
  for (const collectionRoute of collectionRoutes) {
    const contentRoute = createContentRoute(collectionRoute);
    collectionRoute.addChildren([contentRoute]);
  }
  root.addChildren(collectionRoutes);

  return root;
}
