import { useEffect, useState } from "react";
import { createHighlighter, Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
// Move highlighter instance outside to act as a singleton,
// but don't use top-level await to prevent blocking the bundle.
let highlighterPromise: Promise<Highlighter> | null = null;

export interface CodeProps {
  code: string;
  language?: string;
  theme?: string;
}

export function Code({
  code,
  language = "typescript",
  theme = "poimandres",
}: CodeProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    async function highlightCode() {
      // Initialize highlighter only once
      if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
          // OPTIMIZATION: Only load the themes/langs you actually use!
          themes: [theme],
          langs: [language],
          engine: createJavaScriptRegexEngine(),
        });
      }

      const highlighter = await highlighterPromise;

      // Ensure the language/theme is loaded before rendering
      if (!highlighter.getLoadedLanguages().includes(language)) {
        await highlighter.loadLanguage(language as any);
      }
      if (!highlighter.getLoadedThemes().includes(theme)) {
        await highlighter.loadTheme(theme as any);
      }

      const renderedHtml = highlighter.codeToHtml(code, {
        lang: language,
        theme: theme,
      });

      setHtml(renderedHtml);
    }

    highlightCode();
  }, [code, language, theme]);

  // Render a fallback while loading, then inject the HTML safely
  return html ? (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <pre>
      <code>{code}</code>
    </pre> // Fallback while loading
  );
}
