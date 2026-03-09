import { ThemeProvider } from "@lonik/themer";
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

export function PrestigeShell({
  children,
  options,
}: {
  children: ReactNode;
  options: PrestigeRootRouteOptions;
}) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system">
      <Header {...options} />
      <main className="min-h-[calc(100vh-var(--spacing-header))]">
        {children}
      </main>
      <Footer {...options} />
    </ThemeProvider>
  );
}
