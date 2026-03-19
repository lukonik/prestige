import { ThemeProvider } from "@lonik/themer";
import { ReactNode } from "react";
import Footer from "../core/footer/footer";
import Header from "../core/header/header";

type RenderNode = () => ReactNode;

export interface AlgoliaOptions {
  appId: string;
  apiKey: string;
  indices: string[];
}
export interface LicenseOptions {
  label: string;
  url: string;
}
export interface PrestigeShellProps {
  customHeaderTitle?: RenderNode | undefined;
  copyright?: RenderNode | undefined;
  github?: string | undefined;
  algolia?: AlgoliaOptions | undefined;
  license?: LicenseOptions | undefined;
}
export function PrestigeShell({
  children,
  options,
}: {
  children: ReactNode;
  options?: PrestigeShellProps;
}) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system">
      <Header
        algolia={options?.algolia}
        customHeaderTitle={options?.customHeaderTitle}
        {...options}
      />
      <main className="min-h-[calc(100vh-var(--spacing-header))]">
        {children}
      </main>
      <Footer license={options?.license} copyright={options?.copyright} />
    </ThemeProvider>
  );
}
