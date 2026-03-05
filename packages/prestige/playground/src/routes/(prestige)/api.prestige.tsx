import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/api/prestige";
import { ContentComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/api/prestige")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentComponent {...rest}>
      <Content />
    </ContentComponent>
  );
}
