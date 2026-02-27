import { AnyRoute } from "@tanstack/react-router";
import createCollectionRoute from "./collection.route";
import createContentRoute from "./content.route";
export function prestigeRoutes(root: AnyRoute) {
  const collectionRoute = createCollectionRoute(root);
  const contentRoute = createContentRoute(collectionRoute);

  collectionRoute.addChildren([contentRoute]);
  root.addChildren([collectionRoute]);
  return root;
}
