import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import { h } from "hastscript";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkFlexibleToc, { TocItem } from "remark-flexible-toc";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { PluggableList } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import { Compatible, VFile } from "vfile";
import { PrestigeConfig } from "../config/config.types";

export default function remarkAdmonitions() {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.type !== "containerDirective") {
          const data = node.data || (node.data = {});
          const hast = h(node.type === "textDirective" ? "span" : "aside", {
            className: ["admonition", `admonition-${node.name}`],
            ...node.attributes,
          });
          data.hName = hast.tagName;
          data.hProperties = hast.properties;
          return;
        }

        const type = ["note", "tip", "caution", "danger"].includes(node.name)
          ? node.name
          : "note";

        const typeMap: Record<"note" | "tip" | "caution" | "danger", string> = {
          note: "bg-blue-50/50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-200",
          tip: "bg-purple-50/50 dark:bg-purple-900/20 border-purple-500 text-purple-900 dark:text-purple-200",
          caution:
            "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-200",
          danger:
            "bg-red-50/50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-200",
        };

        const data = node.data || (node.data = {});
        data.hName = "aside";
        data.hProperties = {
          "aria-label": type.charAt(0).toUpperCase() + type.slice(1),
          className: [
            "relative",
            "my-6",
            "px-4",
            "py-3",
            "border-l-4",
            "rounded-lg",
            ...(typeMap[type as keyof typeof typeMap] || typeMap["note"]).split(
              " ",
            ),
          ],
          ...node.attributes,
        };

        let titleNodeIndex = node.children.findIndex(
          (c: any) => c.data?.directiveLabel,
        );
        let titleChildren: any[];

        if (titleNodeIndex !== -1) {
          titleChildren = node.children[titleNodeIndex].children;
          node.children.splice(titleNodeIndex, 1);
        } else {
          titleChildren = [
            {
              type: "text",
              value: type.charAt(0).toUpperCase() + type.slice(1),
            },
          ];
        }

        const getIconHast = (t: string) => {
          const props = {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: ["w-5", "h-5", "flex-shrink-0"],
          };
          if (t === "note")
            return h("svg", props, [
              h("circle", { cx: "12", cy: "12", r: "10" }),
              h("path", { d: "M12 16v-4" }),
              h("path", { d: "M12 8h.01" }),
            ]);
          if (t === "tip")
            return h("svg", props, [
              h("path", {
                d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
              }),
              h("path", {
                d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
              }),
              h("path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }),
              h("path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }),
            ]);
          if (t === "caution")
            return h("svg", props, [
              h("path", {
                d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
              }),
              h("path", { d: "M12 9v4" }),
              h("path", { d: "M12 17h.01" }),
            ]);
          if (t === "danger")
            return h("svg", props, [
              h("polygon", {
                points:
                  "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2",
              }),
              h("path", { d: "M12 8v4" }),
              h("path", { d: "M12 16h.01" }),
            ]);
          return null;
        };

        const titleBlock = {
          type: "paragraph",
          data: {
            hName: "p",
            hProperties: {
              className: [
                "flex",
                "items-center",
                "gap-2",
                "mb-2",
                "mt-0",
                "font-bold",
                "text-lg",
              ],
            },
          },
          children: [
            {
              type: "text",
              value: "",
              data: { hName: "span", hChildren: [getIconHast(type)] },
            },
            ...titleChildren,
          ],
        };

        const contentBlock = {
          type: "paragraph",
          data: {
            hName: "section",
            hProperties: {
              className: ["[&>p]:mt-0", "[&>p]:mb-2", "[&>p:last-child]:mb-0"],
            },
          },
          children: node.children,
        };

        node.children = [titleBlock, contentBlock];
      }
    });
  };
}

export function rehypeAddNotProseToPre() {
  return (tree: Node) => {
    visit(tree, (node: any) => {
      // Look specifically for HTML elements that are <pre> tags
      if (node.type === "element" && node.tagName === "pre") {
        node.properties = node.properties || {};

        // HAST classNames are generally arrays of strings
        const currentClass = node.properties.className || [];
        node.properties.className = Array.isArray(currentClass)
          ? [...currentClass, "not-prose"]
          : [currentClass, "not-prose"];
      }
    });
  };
}

export async function compileMarkdown(
  content: Readonly<Compatible>,
  baseUrl: string,
  options?: PrestigeConfig["markdown"],
): Promise<{
  data: { code: string; toc: TocItem[] } | null;
  error: null | any;
}> {
  try {
    const toc: TocItem[] = [];

    const rehypePlugins: PluggableList = [
      ...(options?.rehypePlugins ?? []),
      rehypeSlug,
      [rehypePrism, { options: { showLineNumbers: false } }],
      rehypeAddNotProseToPre,
    ];

    const remarkPlugins: PluggableList = [
      ...(options?.remarkPlugins ?? []),
      remarkFrontmatter,
      [remarkGfm, options?.gfmOptions || {}],
      remarkDirective,
      remarkAdmonitions,
      [remarkFlexibleToc, { tocRef: toc }],
    ];
    const code = await compile(content, {
      outputFormat: "program",
      rehypePlugins,
      remarkPlugins,
      baseUrl: baseUrl,
    });
    return { data: { code: String(code), toc }, error: null };
  } catch (error: any) {
    // 1. Fallback regex to extract coordinates from MDX JSX errors
    if (!error.line && error.reason) {
      const match = error.reason.match(/\((\d+):(\d+)-(\d+):(\d+)\)$/);
      if (match) {
        error.line = parseInt(match[1], 10);
        error.column = parseInt(match[2], 10);
        error.place = {
          start: { line: error.line, column: error.column },
          end: { line: parseInt(match[3], 10), column: parseInt(match[4], 10) },
        };
      }
    }

    // 2. Ensure the file path is explicitly propagated to the error object
    let filePath = error.file || "";
    if (
      !filePath &&
      content &&
      typeof content === "object" &&
      "path" in content
    ) {
      filePath = content.path as string;
    }

    // 3. Generate a visual code snippet for the UI
    let snippet = "";
    if (error.line && content) {
      const text =
        typeof content === "string"
          ? content
          : String((content as any).value || content);
      const lines = text.split("\n");
      const errorLineIdx = error.line - 1; // 0-indexed

      const startLineIdx = Math.max(0, errorLineIdx - 2);
      const endLineIdx = Math.min(lines.length - 1, errorLineIdx + 2);

      const snippetLines = [];
      for (let i = startLineIdx; i <= endLineIdx; i++) {
        const isErrorLine = i === errorLineIdx;
        const lineNumber = String(i + 1).padStart(3, " ");
        const prefix = isErrorLine ? "> " : "  ";
        snippetLines.push(`${prefix}${lineNumber} | ${lines[i]}`);

        if (isErrorLine && error.column) {
          const padding = Math.max(0, error.column - 1);
          snippetLines.push(`      | ${" ".repeat(padding)}^`);
        }
      }
      snippet = snippetLines.join("\n");
    }

    // 4. Return a plain object so JSON.stringify serializes properties correctly
    const plainError = {
      message: error.message || String(error),
      reason: error.reason,
      line: error.line,
      column: error.column,
      file: filePath,
      snippet: snippet,
    };

    return { data: null, error: plainError };
  }
}

export async function compileFrontmatter(vFile: VFile) {
  const result = matter(String(vFile.value));
  return result.data || {};
}

export function warmupCompiler(options?: PrestigeConfig["markdown"]) {
  compileMarkdown("```js\n```", "http://localhost", options).catch(() => {});
}
