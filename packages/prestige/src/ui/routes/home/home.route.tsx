import { AnyRoute, createRoute } from "@tanstack/react-router";

export default function createHomeRoute(root: AnyRoute) {
  const homeRoute = createRoute({
    path: "/",
    getParentRoute: () => root,
    component: () => {
      return (
        <main>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-7xl">Prestige</h1>
            <h2 className="text-5xl">Static Site Generator built with Tanstack-start</h2>
            <button className="bg-primary text-on-primary h-12 mt-10 rounded-md font-bold px-10">
              Get Started
            </button>
          </div>
        </main>
      );
    },
  });

  return homeRoute;
}
