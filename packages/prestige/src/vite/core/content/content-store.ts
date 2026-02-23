import { readFile } from "node:fs/promises";
import { parseContent } from "./content-parser";

export function work() {
  console.log("WORKS");
}

export async function getContentByPath(path: string) {
  try {
    const file = await readFile(path, "utf-8");
    const article = parseContent(file);
    return article;
  } catch (err) {
    console.log(err);
    return;
  }
}
