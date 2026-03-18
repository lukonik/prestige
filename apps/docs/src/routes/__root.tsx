import type { PrestigeShellProps } from "@lonik/prestige/ui";
import { PrestigeShell } from "@lonik/prestige/ui";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestige/config";
import HeaderLogo from "../assets/logo.png?$oh";
import appCss from "../styles.css?url";

const options: PrestigeShellProps = {
  customHeaderTitle: () => (
    <HeaderLogo alt="header logo" className="w-10 h-10" />
  ),
  copyright: () => (
    <a
      className="underline"
      href="https://github.com/lukonik/Prestige"
      target="_blank"
      rel="norefferer"
    >
      Built with Prestige 🎩
    </a>
  ),
  license: {
    label: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
  github: "https://github.com/lukonik/prestige",
  algolia: {
    appId: "IYIAYOLJHX",
    apiKey: "137a443b7b9b637b8b76b11a2c82c15e",
    indices: ["prestigeprestige"],
  },
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/prestige/favicon.ico" },
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
