import { tmpdir } from "node:os";
import { join } from "node:path";
export function getTempDir(...dirs: string[]) {
  const TEST_DIR = `test-dir-${process.env["VITEST_WORKER_ID"] || "0"}`;
  const path = join(tmpdir(), TEST_DIR, ...dirs);
  return path;
}
