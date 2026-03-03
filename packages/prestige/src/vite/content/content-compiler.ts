import { compile } from "@mdx-js/mdx";
import { Compatible } from "vfile";

export async function compileMarkdown(content: Readonly<Compatible>) {
  const code = await compile(content, {
    outputFormat: "program",
  });
  return code;
}
