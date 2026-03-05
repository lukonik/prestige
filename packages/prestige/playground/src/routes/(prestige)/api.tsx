import { createFileRoute, Outlet } from "@tanstack/react-router";
import sidebar from "virtual:prestige/sidebar/api";
import { CollectionComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/api")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log(sidebar);
  return (
    <>
      <CollectionComponent sidebar={sidebar} />
      <Outlet />
    </>
  );
}
