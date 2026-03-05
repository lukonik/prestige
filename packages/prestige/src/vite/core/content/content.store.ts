import { SidebarType, SidebarItemType, SidebarLinkType, ContentMatter } from "./content.types";
import { genDynamicImport, genObjectFromRaw } from "knitwork";
import { genExportDefault, genExportUndefined } from "../../utils/code-generation";
import { join } from "node:path";
import { glob } from "tinyglobby";
import { parse, relative } from "pathe";
import { matter } from "vfile-matter";
import { read } from "to-vfile";
import { VFile } from "vfile";
import { compileMarkdown } from "../../content/content-compiler";
import { PrestigeConfig } from "../../config/config.types";

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
type LocalVFile = VFile & { data: ContentMatter };

export class ContentStore {
  private _store = new Map<string, SidebarLinkType>();
  private _files = new Map<string, LocalVFile>();
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

  async invalidate(path: string) {
    const { slug, vFile } = await processFile(path, this.contentDir);
    const existingFile = this._files.get(slug);
    if (existingFile && existingFile.data) {
      vFile.data = { ...existingFile.data };
    }
    this._files.set(slug, vFile);
  }

  getFileBySlug(slug: string): undefined | VFile {
    return this._files.get(slug);
  }

  getMatter(file: VFile) {
    return file.data["matter"] as ContentMatter;
  }

  getVirtualModuleIdsForFile(path: string) {
    const slug = getSlugByPath(path, this.contentDir);
    return ["\0" + this._virtualId + slug, "\0" + this._virtualIdAll];
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

  async load(id: string, options?: Pick<PrestigeConfig, "markdown">) {
    if (id.includes("\0" + this._virtualIdAll)) {
      const records: Record<string, string> = {};
      for (const [key] of this._store.entries()) {
        records[key] = genDynamicImport(`virtual:prestige/content/${key}`);
      }
      return genExportDefault(genObjectFromRaw(records));
    }

    if (id.includes("\0" + this._virtualId)) {
      const pathPart = id.replace("\0" + this._virtualId, "");
      const file = this._files.get(pathPart);
      if (!file) {
        return genExportUndefined();
      }

      const { code, toc } = await compileMarkdown(file.toString(), options?.markdown);
      if (!code) {
        return genExportUndefined();
      }

      let rseolvedCode = code;

      rseolvedCode += `\n export const toc = ${JSON.stringify(toc)}\n`;
      if (file.data["prev"]) {
        rseolvedCode += `\n export const prev = ${JSON.stringify(file.data["prev"])}\n`;
      }
      if (file.data["next"]) {
        rseolvedCode += `\n export const next = ${JSON.stringify(file.data["next"])}\n`;
      }

      return rseolvedCode;
    }

    return null;
  }
}
