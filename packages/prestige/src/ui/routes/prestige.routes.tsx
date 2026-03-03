import { AnyRoute } from "@tanstack/react-router";
import createCollectionRoute from "./collection/collection.route";
import createContentRoute from "./content/content.route";
import createHomeRoute from "./home/home.route";

class PrestigeRoute {
  private _childrenRoutes: AnyRoute[];
  private _buildRoutes: AnyRoute[] = [];

  constructor(private root: AnyRoute) {
    this._childrenRoutes = root.children;
  }

  withHome() {
    this._buildRoutes.push(createHomeRoute(this.root));
    return this;
  }

  private buildContentRoutes() {
    const collectionRoutes = createCollectionRoute(this.root);

    for (const collectionRoute of collectionRoutes) {
      const contentRoute = createContentRoute(collectionRoute);
      collectionRoute.addChildren([contentRoute]);
    }

    this._buildRoutes.push(...collectionRoutes);
  }

  build() {
    this.buildContentRoutes();
    const allProposed = [...this._childrenRoutes, ...this._buildRoutes];
    const uniqueChildren = allProposed.filter(
      (route, index, self) =>
        index === self.findIndex((r) => (r.options as any).path === (route.options as any).path),
    );

    this.root.addChildren(uniqueChildren);
    return this.root;
  }
}

export function prestigeRoutes(root: AnyRoute) {
  return new PrestigeRoute(root);
}
