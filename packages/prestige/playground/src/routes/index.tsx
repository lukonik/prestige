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
              Star on Github{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-github-icon lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
