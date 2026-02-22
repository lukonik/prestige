import { tmpdir } from "node:os";
import { join } from "node:path";
export function getTempDir(dir?: string) {
  const TEST_DIR = "test-dir";
  const path = join(tmpdir(), TEST_DIR, dir ?? "");
  return path;
}
