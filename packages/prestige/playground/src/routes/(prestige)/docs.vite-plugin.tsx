import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/docs/vite-plugin";
import { ContentComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/docs/vite-plugin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentComponent {...rest}>
      <Content />
    </ContentComponent>
  );
}
