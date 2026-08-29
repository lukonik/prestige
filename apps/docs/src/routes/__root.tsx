import {
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestige/config";
import appCss from "../styles.css?url";

const socialImageUrl = "https://lukonik.github.io/prestigia/logo.png";
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

function WebsiteProgressOverlay() {
  return (
    <main className="progress-overlay" aria-labelledby="progress-title">
      <div className="progress-overlay__glow" aria-hidden="true" />
      <section className="progress-overlay__content">
        <span className="progress-overlay__eyebrow">Prestigia</span>
        <h1 id="progress-title">Website is in progress</h1>
        <p>Stay tuned.</p>
        <div className="progress-overlay__indicator" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}

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
      { rel: "icon", href: "/prestigia/favicon.ico" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="progress-page">
        <WebsiteProgressOverlay />
        <Scripts />
      </body>
    </html>
  ),
});
