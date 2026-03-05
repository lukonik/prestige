import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/docs/image/loaders/custom-loader";
import { ContentComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/(prestige)/docs/image/loaders/custom-loader")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentComponent {...rest}>
      <Content />
    </ContentComponent>
  );
}
