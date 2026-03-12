import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import config from "virtual:prestige/config";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container mx-auto flex justify-center flex-col items-center">
        <h1 className="text-3xl lg:text-8xl font-medium leading-snug mt-2 lg:mt-10 uppercase">
          {config.title}
        </h1>
        <h2 className="text-3xl lg:text-6xl font-medium leading-snug ">
          Your great project
        </h2>
        <div className="mt-10 flex lg:justify-start items-center justify-center gap-4">
          <Link to="/docs/introduction">
            <button className="rounded-full px-4 lg:px-8 bg-primary-600 text-white lg:h-14 h-12 flex items-center justify-center gap-4 cursor-pointer">
              Introduction <ArrowRight size={20} />
            </button>
          </Link>
          <a href="https://github.com/lukonik/Prestige" target="_blank">
            <button className="rounded-full px-4 lg:px-8  h-14 flex items-center justify-center gap-4 cursor-pointer">
              Star on Github <Github />
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
