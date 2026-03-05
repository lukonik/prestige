import { createFileRoute, Outlet } from "@tanstack/react-router";
import sidebar from "virtual:prestige/sidebar/docs";
import { CollectionComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/docs")({
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
