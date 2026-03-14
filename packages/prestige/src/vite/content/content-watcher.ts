import chokidar from "chokidar";
import debounce from "debounce";

export function initContentWatcher(contentDir: string, onUpdate: () => void) {
  const UPDATE_INTERVAL = 1000;
  const scheduleUpdate = debounce(onUpdate, UPDATE_INTERVAL);

  const watcher = chokidar
    .watch(contentDir, {
      awaitWriteFinish: true,
      ignoreInitial: true,
    })
    .on("all", (event) => {
      if (event !== "add" && event !== "unlink") {
        return;
      }

      // Coalesce bursts of filesystem events into one update run per interval.
      scheduleUpdate();
    });

  return () => {
    scheduleUpdate.clear();
    return watcher.close();
  };
}
