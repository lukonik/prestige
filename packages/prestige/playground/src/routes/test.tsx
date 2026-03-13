import { createFileRoute } from "@tanstack/react-router";
import { Steps, StepItem } from "@lonik/prestige/ui";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-10">
      <Steps>
        <StepItem index="1" label="Step One">
          MD, MDX, and GFM compilation integrated out of the box. Extend
          capabilities via rehype and remark plugins.
        </StepItem>
        <StepItem index="2" label="Step Two">
          Built on Vite, so the entire Vite ecosystem is at your disposal.
        </StepItem>
      </Steps>
    </div>
  );
}
