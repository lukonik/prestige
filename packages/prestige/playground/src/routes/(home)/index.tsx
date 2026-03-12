import { createFileRoute} from "@tanstack/react-router";
import { Hero } from "./-components/hero";

export const Route = createFileRoute("/(home)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
     <Hero />
    </div>
  );
}
