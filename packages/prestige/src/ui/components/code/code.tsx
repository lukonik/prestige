import { RehypeShikiOptions } from "@shikijs/rehype";
import { ShikiHighlighter, Language } from "react-shiki";
import type { BundledTheme } from "shiki";
export interface CodeProps {
  code?: string;
  language?: Language;
  theme?: BundledTheme | string;
  children?: string;
}

const shikiOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
};

export function Code({ code, language = "typescript", children }: CodeProps) {
  const content = code ?? children ?? "";

  return (
    <ShikiHighlighter language={language} theme={shikiOptions.themes}>
      {content}
    </ShikiHighlighter>
  );
}
