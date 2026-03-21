import { ThemeProvider } from "@lonik/themer";
import { ReactNode } from "react";
import config from "virtual:prestige/config";
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
export interface PrestigeSerializableShellProps {
  github?: string | undefined;
  algolia?: AlgoliaOptions | undefined;
  license?: LicenseOptions | undefined;
}
export interface PrestigeShellProps extends PrestigeSerializableShellProps {
  customHeaderTitle?: RenderNode | undefined;
  copyright?: RenderNode | undefined;
}
export function PrestigeShell({
  children,
  options,
}: {
  children: ReactNode;
  options?: PrestigeShellProps;
}) {
  const resolvedOptions: PrestigeShellProps = {
    ...config.prestigeShellProps,
    ...options,
  };

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system">
      <Header
        algolia={resolvedOptions.algolia}
        customHeaderTitle={resolvedOptions.customHeaderTitle}
        {...resolvedOptions}
      />
      <main className="min-h-[calc(100vh-var(--spacing-header))]">
        {children}
      </main>
      <Footer
        license={resolvedOptions.license}
        copyright={resolvedOptions.copyright}
      />
    </ThemeProvider>
  );
}
