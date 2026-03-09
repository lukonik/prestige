import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import Heroimage from "../assets/oh-image-hero.svg?$oh";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex mx-auto lg:w-6xl items-start pt-20">
      <div>
        <h1 className="text-6xl font-medium leading-snug mt-10">
          The Missing &lt;Image /&gt; Component for
          <span className="font-black ml-2 text-primary-600">React</span>
        </h1>
        <div className="mt-10 flex items-center gap-4">
          <Link to="/docs/introduction">
            <button className="rounded-full px-8 bg-primary-600 text-white h-14 flex items-center justify-center gap-4 cursor-pointer">
              Introduction <ArrowRight size={20} />
            </button>
          </Link>

          <a href="https://github.com/lukonik/Prestige" target="_blank">
            <button className="rounded-full px-8  h-14 flex items-center justify-center gap-4 cursor-pointer">
              Star on Github <Github />
            </button>
          </a>
        </div>
      </div>

      <div className="shrink-0">
        <Heroimage className="w-100 h-100" />
      </div>
    </div>
  );
}
