import { normalizePath, ViteDevServer } from "vite";
import logger from "./logger";
import { join } from "node:path";

export function watchConfigChange(server: ViteDevServer, sources: string[]) {
  server.watcher.add(sources);

  server.watcher.on("change", (file) => {
    if (sources.includes(file)) {
      logger.info("✅ config file has changed, restarti2222ng");
      server.restart();
    }
  });
}

export async function watchMarkdownChange(server: ViteDevServer, markdownDir: string) {
  // const mdFiles = await glob(join(markdownDir, normalizePath("**/*.md")));
  server.watcher.add(join(markdownDir, normalizePath("**/*.md")));

  server.watcher.on("change", (path) => {
    if (path.includes(markdownDir) && path.includes(".md")) {
      logger.info("🔥  config file has changed, restarti2222ng");
      server.restart();
    }
  });
}
