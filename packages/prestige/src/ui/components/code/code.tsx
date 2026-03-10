import { useEffect, useState } from "react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";

export interface CodeProps {
  code?: string;
  language?: BundledLanguage;
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
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      try {
        const highlightedHtml = await codeToHtml(content, {
          lang: language,
          // Using your dual themes setup
          themes: shikiOptions.themes,
        });

        if (isMounted) {
          setHtml(highlightedHtml);
        }
      } catch (error) {
        console.error("Shiki highlight error:", error);
        // Fallback to raw text if highlighting fails
        if (isMounted) {
          setHtml(`<pre><code>${content}</code></pre>`);
        }
      }
    }

    highlight();

    return () => {
      isMounted = false;
    };
  }, [content, language]);

  // Render raw content while Shiki is loading to prevent layout shift
  if (!html) {
    return (
      <pre>
        <code>{content}</code>
      </pre>
    );
  }

  // Render the highlighted HTML
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
