import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Prestigia Docs" },
      {
        name: "description",
        content: "Documentation built with Prestigia.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootLayout() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          Prestigia
        </Link>
        <a href="https://github.com/lukonik/prestigia">GitHub</a>
      </header>
      <Outlet />
      <footer className="site-footer">
        TanStack Start · Tailwind CSS · Shadcn · Content Collections
      </footer>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="page-shell">
      <p className="eyebrow">404</p>
      <h1>That document does not exist.</h1>
      <Link to="/">Return to the documentation index</Link>
    </main>
  );
}
