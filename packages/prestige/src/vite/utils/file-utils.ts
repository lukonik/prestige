import { stat, mkdir, writeFile, rm } from "node:fs/promises";
import { dirname } from "pathe";

export async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string) {
  await mkdir(dirPath, { recursive: true });
}

export async function outputFile(filePath: string, data: string | NodeJS.ArrayBufferView) {
  const dir = dirname(filePath);

  // recursive: true won't throw if the dir already exists
  await mkdir(dir, { recursive: true });
  await writeFile(filePath, data);
}

export async function rmSafe(path: string) {
  try {
    await rm(path, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
