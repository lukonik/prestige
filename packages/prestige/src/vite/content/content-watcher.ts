import debounce from "debounce";
import { join } from "pathe";
import picomatch from "picomatch";
import { ViteDevServer } from "vite";

function initWatcher(
  path: string,
  events: Array<"add" | "unlink" | "change">,
  server: ViteDevServer,
  onChange: () => void,
  debounceInterval: number,
) {
  const isDocsMatcher = picomatch(path);

  const UPDATE_INTERVAL = debounceInterval;
  const schedule = debounce(() => {
    onChange();
  }, UPDATE_INTERVAL);
  const onFileChange = (file: string) => {
    console.log("CHANGIING ", file);
    if (!isDocsMatcher(file)) {
      return;
    }
    schedule();
  };
  server.watcher.add(path);
  events.forEach((event) => {
    server.watcher.on(event, onFileChange);
  });

  server.httpServer?.on("close", () => {
    schedule.clear();
  });

  return () => {
    schedule.clear();
  };
}

export function initContentWatcher(contentDir: string, server: ViteDevServer) {
  const contentPath = join(contentDir, "**/*.{md,mdx}");
  const clear = initWatcher(
    contentPath,
    ["add", "unlink", "change"],
    server,
    () => {
      server.restart();
    },
    1000,
  );
}

export function initConfigChangeWatcher(
  configPath: string,
  server: ViteDevServer,
  onChange: () => void,
) {
  initWatcher(configPath, ["change"], server, onChange, 300);
}
