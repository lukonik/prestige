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

const socialImageUrl = "https://lukonik.github.io/prestige/logo.png";
const socialImageAlt = "Prestige logo";
const siteKeywords = [
  "prestige",
  "documentation framework",
  "docs",
  "mdx",
  "markdown",
  "react",
  "tanstack start",
  "tanstack router",
  "vite",
  "tailwind css",
].join(", ");

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
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: siteKeywords },
      { property: "og:site_name", content: config.title },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: socialImageUrl },
      { property: "og:image:alt", content: socialImageAlt },
      { name: "twitter:image", content: socialImageUrl },
      { name: "twitter:image:alt", content: socialImageAlt },
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
