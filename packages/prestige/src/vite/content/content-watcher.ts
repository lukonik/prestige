import debounce from "debounce";
import { join } from "pathe";
import picomatch from "picomatch";
import { ViteDevServer } from "vite";

export function initContentWatcher(contentDir: string, server: ViteDevServer) {
  const isDocsMatcher = picomatch(join(contentDir, "**/*.{md,mdx}"));

  const UPDATE_INTERVAL = 1000;
  const schedule = debounce(() => {
    server.restart();
  }, UPDATE_INTERVAL);
  const onFileChange = (file: string) => {
    if (!isDocsMatcher(file)) {
      return;
    }
    schedule();
  };
  server.watcher.add(contentDir);
  server.watcher.on("add", onFileChange);
  server.watcher.on("unlink", onFileChange);

  server.httpServer?.on("close", () => {
    schedule.clear();
  });
}
