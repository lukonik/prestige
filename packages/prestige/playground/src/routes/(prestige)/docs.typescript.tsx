import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/docs/typescript";
import { ContentComponent } from "@lonik/prestige/ui";

export const Route = createFileRoute("/docs/typescript")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentComponent {...rest}>
      <Content />
    </ContentComponent>
  );
}
