import { readFile } from "node:fs/promises";
import { parseArticle } from "./article-parser";

export function work() {
  console.log("WORKS");
}

export async function getArticleByPath(path: string) {
  try {
    const file = await readFile(path, "utf-8");
    const article = parseArticle(file);
    return article;
  } catch (err) {
    console.log(err);
    return;
  }
}
