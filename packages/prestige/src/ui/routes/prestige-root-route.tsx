import { ThemeProvider } from "@lonik/themer";
import {
  AnyRouteMatch,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import Header from "../core/header/header";

export interface PrestigeRootRouteOptions {
  appCss: string;
  favicon?: string;
  title: string;
  description?: string;
}

export function createPrestigeRootRoute(options: PrestigeRootRouteOptions) {
  const links: AnyRouteMatch["links"] = [];
  const metas: AnyRouteMatch["meta"] = [];

  if (options.appCss) {
    links.push({
      rel: "stylesheet",
      href: options.appCss,
    });
  }

  if (options.favicon) {
    links.push({
      rel: "icon",
      href: options.favicon,
    });
  }
  metas.push({
    title: options.title,
  });
  if (options.description) {
    metas.push({
      name: "description",
      content: options.description,
    });
  }

  return createRootRoute({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...metas,
      ],
      links: links,
    }),
    shellComponent: ({ children }: { children: React.ReactNode }) => {
      return (
        <html lang="en" suppressHydrationWarning>
          <head>
            <HeadContent />
          </head>
          <body>
            <ThemeProvider attribute="data-theme" defaultTheme="system">
              <Header />
              {children}
              {/* <TanStackDevtools
          config={{
            position: "middle-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
            </ThemeProvider>

            <Scripts />
          </body>
        </html>
      );
    },
  });
}
