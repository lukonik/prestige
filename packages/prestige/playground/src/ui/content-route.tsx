import { createRoute, RootRoute } from "@tanstack/react-router";

export default function (root: RootRoute<any>) {
  const contentRouter = createRoute({
    getParentRoute: () => root,
    path: "content",
    component: () => <div>Content</div>,
  });
  return contentRouter;
}
