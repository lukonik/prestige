import { useEffect, useState } from "react";
import { BundledLanguage, createHighlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const jsEngine = createJavaScriptRegexEngine();

const shiki = await createHighlighter({
  themes: ["github-dark", "github-light"],
  langs: [
    "tsx",
    "javascript",
    "typescript",
    "css",
    "html",
    "jsx",
    "json",
    "bash",
  ],
  engine: jsEngine,
});

export interface CodeProps {
  code: string;
  language?: BundledLanguage;
}
export function Code({ code, language = "html" }: CodeProps) {
  const [render, setRender] = useState("");
  useEffect(() => {
    if (!code) {
      return;
    }

    async function highlight() {
      await shiki.loadLanguage(language);

      const html = shiki.codeToHtml(code, {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      });
      setRender(html);
    }

    highlight();
  }, [code, language]);

  return <>{render && <div dangerouslySetInnerHTML={{ __html: render }} />}</>;
}
