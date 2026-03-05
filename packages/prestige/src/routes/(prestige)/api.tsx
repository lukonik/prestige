import { createFileRoute, Outlet } from "@tanstack/react-router";
import sidebar from "virtual:prestige/sidebar/api";
import { CollectionComponent, collectionLoader } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/api")({
  component: RouteComponent,
  loader: ({ location }) => collectionLoader(location, sidebar, "api"),
});

function RouteComponent() {
  return (
    <>
      <CollectionComponent sidebar={sidebar} />
      <Outlet />
    </>
  );
}
