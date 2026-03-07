import { ThemeProvider } from "@lonik/themer";
import {
  AnyRootRoute,
  AnyRouteMatch,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestige/config";
import Header from "../components/header/header";

export function createPrestigeRootRoute(options: {
  appCss: string;
}): AnyRootRoute {
  const links: AnyRouteMatch["links"] = [];

  if (options.appCss) {
    links.push({
      rel: "stylesheet",
      href: options.appCss,
    });
  }

  if (config.favicon) {
    links.push({
      rel: "icon",
      href: config.favicon,
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
        {
          title: config.title,
        },
        {
          name: "description",
          content: config.description,
        },
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
