import { ThemeProvider } from "@lonik/themer";
import { ReactNode } from "react";
import Footer from "../core/footer/footer";
import Header from "../core/header/header";

export interface PrestigeShellProps {
  customHeaderTitle?: (() => ReactNode) | undefined;
  copyright?: (() => ReactNode) | null | undefined;
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
      <Header customHeaderTitle={options?.customHeaderTitle} {...options} />
      <main className="min-h-[calc(100vh-var(--spacing-header))]">
        {children}
      </main>
      <Footer copyright={options?.copyright} />
    </ThemeProvider>
  );
}
