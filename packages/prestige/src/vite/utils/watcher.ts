import { ViteDevServer } from "vite";
import logger from "./logger";
import { join } from "pathe";
import picomatch from "picomatch";

export function watchFiles(
  server: ViteDevServer,
  files: string[] | string,
  cb: (file: string) => void,
) {
  server.watcher.add(files);
  const isMatch = picomatch(files);
  server.watcher.on("change", (file) => {
    if (isMatch(file)) {
      cb(file);
    }
  });
}

export function watchConfigChange(server: ViteDevServer, sources: string[]) {
  watchFiles(server, sources, () => {
    logger.info("✅ config file has changed, restarti2222ng");
    server.restart();
  });
}

export async function watchMarkdownChange(server: ViteDevServer, markdownDir: string) {
  watchFiles(server, join(markdownDir, "**/*.md"), () => {
    logger.info("🔥  config file has changed, restarti2222ng");
  });
}
