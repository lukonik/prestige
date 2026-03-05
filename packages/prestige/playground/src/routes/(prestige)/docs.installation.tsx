import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/docs/installation";
import { ContentComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/docs/installation")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentComponent {...rest}>
      <Content />
    </ContentComponent>
  );
}
