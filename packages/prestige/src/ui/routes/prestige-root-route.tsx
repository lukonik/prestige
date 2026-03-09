import { ThemeProvider } from "@lonik/themer";
import {
  AnyRouteMatch,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ReactNode } from "react";
import Footer from "../core/footer/footer";
import Header from "../core/header/header";

export interface AlgoliaOptions {
  appId: string;
  apiKey: string;
  indices: string[];
}

export interface LicenseOptions {
  label: string;
  url: string;
}
export interface PrestigeRootRouteOptions {
  appCss: string;
  favicon?: string;
  title: string;
  description?: string;
  algolia?: AlgoliaOptions;
  github?: string;
  customHeaderTitle?: () => ReactNode;
  license?: LicenseOptions;
}

export type PrestigeRootRouteContextOptions = Pick<
  PrestigeRootRouteOptions,
  "title" | "description"
>;

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
    beforeLoad: () => {
      return {
        prestigeOptions: {
          title: options.title,
          description: options.description,
        } as PrestigeRootRouteContextOptions,
      };
    },
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
              <Header {...options} />
              <main className="min-h-[calc(100vh-var(--spacing-header))]">
                {children}
              </main>
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
              <Footer {...options} />
            </ThemeProvider>

            <Scripts />
          </body>
        </html>
      );
    },
  });
}
