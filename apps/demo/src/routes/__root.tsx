import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Prestigia Demo",
      },
      {
        name: "description",
        content: "Documentation for Prestigia packages and Agent Skills.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/logo.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootLayout() {
  const isDocsRoute = useLocation({
    select: (location) => location.pathname.startsWith("/docs"),
  });

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6">
          <Link
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
            to="/"
          >
            <img className="size-7" src="/logo.png" alt="Prestigia" />
            Prestigia
            <span className="font-normal text-muted-foreground">Demo</span>
          </Link>
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-1"
          >
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              to="/"
            >
              Home
            </Link>
            <Link
              aria-current={isDocsRoute ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isDocsRoute
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              params={{ slug: "overview" }}
              to="/docs/$slug"
            >
              Docs
            </Link>
            <a
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              href="https://github.com/lukonik/prestigia"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        Built with TanStack Start and TanStack Router.
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
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        {children}

        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="mx-auto min-h-[calc(100svh-8rem)] max-w-3xl px-6 py-24">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        That document does not exist.
      </h1>
      <Link
        className="mt-6 inline-flex text-sm font-medium underline underline-offset-4"
        to="/"
      >
        Return to the documentation index
      </Link>
    </main>
  );
}
