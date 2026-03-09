import { PrestigeShell } from "@lonik/prestige/ui";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import favicon from "../assets/favicon.ico";
import appCss from "../styles.css?url";
import config from "virtual:prestige/config";

const options = {
  appCss,
  favicon: favicon,
  github: "https://github.com/lukonik/Prestige",
  license: {
    label: "MIT License",
    url: "https://opensource.org/licenses/MIT",
  },
  customHeaderTitle: () => (
    <span className="font-rubik text-primary-600 text-2xl">Oh Image</span>
  ),
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
    ],
    links: [
      { rel: "stylesheet", href: options.appCss },
      { rel: "icon", href: options.favicon },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PrestigeShell options={options}>
          <Outlet />
        </PrestigeShell>
        <Scripts />
      </body>
    </html>
  ),
});
