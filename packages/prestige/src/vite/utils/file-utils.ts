import { mkdir, rm, stat, writeFile } from "node:fs/promises";
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

export async function outputFile(
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
) {
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

// Helper function to extract the virtual ID from a messy path
export function extractVirtualId(fullId: string, virtualPrefix: string) {
  const startIndex = fullId.indexOf(virtualPrefix);
  if (startIndex !== -1) {
    // Slice from the start of the virtual prefix to the end of the string
    return "\0" + fullId.slice(startIndex);
  }
  return null;
}
