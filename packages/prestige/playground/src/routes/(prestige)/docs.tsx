import { createFileRoute, Outlet } from "@tanstack/react-router";
import sidebar from "virtual:prestige/sidebar/docs";
import { CollectionComponent, collectionLoader } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/docs")({
  component: RouteComponent,
  loader: ({ location }) => collectionLoader(location, sidebar, "docs"),
});

function RouteComponent() {
  return (
    <>
      <CollectionComponent sidebar={sidebar} />
      <Outlet />
    </>
  );
}
