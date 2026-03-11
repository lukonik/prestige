import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Langs
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import html from "shiki/langs/html.mjs";
import js from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import jsx from "shiki/langs/jsx.mjs";
import tsx from "shiki/langs/tsx.mjs";
import ts from "shiki/langs/typescript.mjs";

// Themes
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";

const jsEngine = createJavaScriptRegexEngine();

// Top-level await requires a modern bundler configuration
const shiki = await createHighlighterCore({
  themes: [githubDark, githubLight],
  langs: [js, ts, html, css, bash, json, tsx, jsx],
  engine: jsEngine,
});

// Create a type for exactly the languages you loaded to prevent runtime crashes
type SupportedLanguage =
  | "js"
  | "ts"
  | "html"
  | "css"
  | "bash"
  | "json"
  | "tsx"
  | "jsx"
  | "javascript"
  | "typescript";

export interface CodeProps {
  code: string;
  language?: SupportedLanguage | (string & {}); // Provides autocomplete but allows any string
}

export function Code({ code, language = "html" }: CodeProps) {
  const [render, setRender] = useState("");

  useEffect(() => {
    if (!code) {
      setRender("");
      return;
    }

    // 1. Setup an ignore flag to prevent React race conditions
    let ignore = false;

    async function highlight() {
      try {
        // 2. Generate the HTML
        const html = shiki.codeToHtml(code, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });

        // 3. Only update state if the component hasn't unmounted or re-rendered
        if (!ignore) {
          setRender(html);
        }
      } catch (error) {
        console.error(
          `Shiki highlight error: Make sure '${language}' is pre-loaded in the core.`,
          error,
        );
        // Fallback to unstyled text so the user at least sees the code
        if (!ignore) {
          setRender(`<pre><code>${code}</code></pre>`);
        }
      }
    }

    highlight();

    // 4. Cleanup function to toggle the ignore flag
    return () => {
      ignore = true;
    };
  }, [code, language]);

  // Use a fragment or div, but ensure `render` actually exists before injecting
  return render ? <div dangerouslySetInnerHTML={{ __html: render }} /> : null;
}
