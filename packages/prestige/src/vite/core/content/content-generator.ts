import { join } from "pathe";
import { glob } from "tinyglobby";
import { getContentByPath } from "./content-store";

export class ContentGenerator {
  private virtualId = "virtual:contents";
  private resolveVirtualId = "\0" + this.virtualId;
  private mapVirtualId = "virtual:contents-map";
  private resolveMapVirtualId = "\0" + this.mapVirtualId;

  constructor(private _docsDir: string) {}

  private isVirtualContent(id: string) {
    return id.includes("virtual:contents/");
  }

  private resolveVirtualContent(id: string) {
    return "\0" + id;
  }

  private isResolveVirtualContent(id: string) {
    return id.startsWith(this.resolveVirtualId);
  }

  resolve(id: string) {
    if (this.isVirtualContent(id)) {
      return this.resolveVirtualContent(id);
    }

    if (id === this.mapVirtualId) {
      return this.resolveMapVirtualId;
    }

    if (id === this.virtualId) {
      return this.resolveVirtualId;
    }
    return null;
  }

  async load(id: string) {
    if (id === this.resolveMapVirtualId) {
      const files = await glob("**/*.md", { cwd: this._docsDir });
      let code = "export const contents = {\n";
      for (const file of files) {
        const slug = file.replace(/\.md$/, "");
        code += `  "${slug}": () => import("virtual:contents/${file}"),\n`;
      }
      code += "};\n";
      return code;
    }

    if (this.isResolveVirtualContent(id)) {
      const slug = id.replace(this.resolveVirtualId, "");
      const contentPath = join(this._docsDir, slug);
      const content = await getContentByPath(contentPath);
      return `export default  ${JSON.stringify(content)}`;
    }

    return null;
  }
}
