import { glob } from "tinyglobby";
import { parseMetadata } from "./content-parser";
import { readFile } from "node:fs/promises";
import { join } from "pathe";

interface ContentItem {
  metadata: any;
  load: string;
}

export class SidebarGenerator {
  private _virtualId: string;
  private _resolveVirtualId: string;
  private _contentMap = new Map<string, ContentItem>();
  private _base: string;
  private _path: string;
  constructor(
    private sidebarId: string,
    contentPath: string,
  ) {
    this._path = join(contentPath, sidebarId);
    this._base = this.sidebarId;
    this._virtualId = `virtual:sidebar-${this._base}`;
    this._resolveVirtualId = "\0" + this._virtualId;
  }

  async buildMap() {
    const files = await glob("**/*.md", { cwd: this._path });
    for (const file of files) {
      const filePath = join(this._path, file);
      const slug = file.replace(/\.md$/, "");
      const loadCode = `() => import("virtual:contents/${file}")`;
      const metadata = await parseMetadata(await readFile(filePath, "utf-8"));
      this._contentMap.set(slug, { metadata, load: loadCode });
    }
  }

  resolveId(id: string) {
    if (this._virtualId === id) {
      return this._resolveVirtualId;
    }
    return null;
  }

  load(id: string) {
    if (this._resolveVirtualId === id) {
      let code = "export default {\n";
      for (const [slug, item] of this._contentMap.entries()) {
        code += `  "${slug}": {\n`;
        code += `    metadata: ${JSON.stringify(item.metadata)},\n`;
        code += `    load: ${item.load}\n`;
        code += `  },\n`;
      }
      code += "};\n";
      return code;
    }

    return null;
  }

  getAll() {
    let code = "export default [\n";
    for (const [key, value] of this._contentMap.entries()) {
      code += `{
    slug: '${key}',
    load: () => import('${this._virtualId}/${key}')
  },\n`;
    }

    code += "];\n";

    return code;
  }
}
