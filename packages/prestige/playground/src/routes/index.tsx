import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
        <h2 className="text-3xl lg:text-6xl font-medium leading-snug">
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
              Star on Github <GitHubIcon />
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C14.8 4.8 16 5 16 5c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.4-2.8 5.4-5.5 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}
