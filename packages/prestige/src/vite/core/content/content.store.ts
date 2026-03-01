import { readFile } from "node:fs/promises";
import { parseContent } from "./content-parser";
import { SidebarType, SidebarItemType, SidebarLinkType } from "./content.types";
import { genDynamicImport, genObjectFromRaw, genObjectFromValues } from "knitwork";
import { genExportDefault, genExportUndefined } from "../../utils/code-generation";
import { join } from "node:path";
import { glob } from "tinyglobby";
import { parse, relative } from "pathe";
import { matter } from "vfile-matter";
import { read } from "to-vfile";
import { VFile } from "vfile";
import { compile } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export async function parseMDXContent(content: string) {
  let toc: { depth: number; text: string; id: string }[] = [];

  function rehypeExtractTocAndAddIds() {
    return (tree: any) => {
      let idCounter = 0;
      const visit = (node: any) => {
        if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
          const text = node.children
            .filter((c: any) => c.type === "text")
            .map((c: any) => c.value)
            .join("");

          const id =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${idCounter++}`;

          node.properties = node.properties || {};
          node.properties.id = id;
          node.properties.className = node.properties.className
            ? `${node.properties.className} scroll-mt-24`
            : "scroll-mt-24";

          toc.push({
            depth: parseInt(node.tagName.charAt(1), 10),
            text,
            id,
          });
        }
        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);
    };
  }

  // This compiles the string into executable JavaScript code
  const code = await compile(content, {
    outputFormat: "function-body",
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    // You can still use your rehype plugins here!
    rehypePlugins: [rehypeExtractTocAndAddIds],
  });

  return { code: String(code), toc };
}

function getSlugByPath(path: string, contentDir: string) {
  // 1. Get the relative path: "zz/zz/myFile.json"
  const relativePath = relative(contentDir, path);

  // 2. Parse the path to separate the extension
  const pathInfo = parse(relativePath);

  const result = join(pathInfo.dir, pathInfo.name);

  return result;
}

async function processFile(path: string, contentDir: string) {
  const vFile = await read(path);
  matter(vFile, { strip: true });

  const slug = await getSlugByPath(path, contentDir);

  return {
    slug,
    vFile,
  };
}

export class ContentStore {
  private _store = new Map<string, SidebarLinkType>();
  private _files = new Map<string, VFile>();
  private _virtualId = "virtual:prestige/content/";
  private _virtualIdAll = "virtual:prestige/content-all";

  constructor(private contentDir: string) {}

  async process() {
    const paths = await glob(`${this.contentDir}/**/*.{md,mdx}`);
    for (const path of paths) {
      const { slug, vFile } = await processFile(path, this.contentDir);

      this._files.set(slug, vFile);
    }
  }

  async init(sidebars: Map<string, SidebarType>) {
    const sidebarsArray = sidebars.values();
    for (const sidebar of sidebarsArray) {
      const links = this._flattenLinks(sidebar.items);
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link) {
          this._store.set(link.slug, link);
          const file = this._files.get(link.slug);
          if (file) {
            file.data = file.data || {};
            if (i > 0) file.data["prev"] = links[i - 1];
            if (i < links.length - 1) file.data["next"] = links[i + 1];
          }
        }
      }
    }
  }

  private _flattenLinks(items: SidebarItemType[]): SidebarLinkType[] {
    const links: SidebarLinkType[] = [];
    for (const item of items) {
      if ("slug" in item) {
        links.push(item);
      } else if ("items" in item) {
        links.push(...this._flattenLinks(item.items));
      }
    }
    return links;
  }

  async resolve(id: string) {
    if (id === this._virtualIdAll) {
      return "\0" + this._virtualIdAll;
    }
    if (id.startsWith(this._virtualId)) {
      return "\0" + id;
    }
    return null;
  }

  async load(id: string) {
    if (id.includes("\0" + this._virtualIdAll)) {
      const records: Record<string, string> = {};
      for (const [key] of this._store.entries()) {
        records[key] = genDynamicImport(`virtual:prestige/content/${key}`, {
          interopDefault: true,
        });
      }
      return genExportDefault(genObjectFromRaw(records));
    }

    if (id.includes("\0" + this._virtualId)) {
      const pathPart = id.replace("\0" + this._virtualId, "");
      const file = this._files.get(pathPart);
      if (!file) {
        return genExportUndefined();
      }

      const { code: content, toc } = await parseMDXContent(file.toString());
      if (!content) {
        return genExportUndefined();
      }
      return genExportDefault(
        genObjectFromValues({
          html: content,
          toc,
          prev: file.data["prev"] || null,
          next: file.data["next"] || null,
        }),
      );

      // if (file.extname === ".mdx") {
      // }
      // if (file) {
      //   const content = await parseContent(file);
      //   if (!content) {
      //     return genExportUndefined();
      //   }
      // }

      // const fullPath = join(this.contentDir, pathPart) + ".md";
      // const content = await getContentByPath(fullPath);
      // if (!content) {
      //   return genExportUndefined();
      // }
      // return genExportDefault(genObjectFromValues({ html: content }));
    }

    return null;
  }
}

export async function getContentByPath(path: string) {
  try {
    const file = await readFile(path, "utf-8");
    const article = parseContent(file);
    return article;
  } catch {
    return;
  }
}
