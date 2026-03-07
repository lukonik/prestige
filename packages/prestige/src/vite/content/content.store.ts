import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { parse, relative } from "pathe";
import { glob } from "tinyglobby";
import { read } from "to-vfile";
import { compileMarkdown } from "./content-compiler";
import { InternalSidebarLinkType } from "../core/content/content.types";

import { compileFrontmatter } from "./content-compiler";
import { PrestigeError } from "../utils/errors";

export const CONTENT_VIRTUAL_ID = "virtual:prestige/content/";

export function resolveSiblings(
  base: string,
  slug: string,
  linksMap: Map<string, InternalSidebarLinkType[]>,
) {
  const links = linksMap.get(base);
  if (!links?.length) {
    return { prev: undefined, next: undefined };
  }
  const linkIndex = links.findIndex((link) => link.slug === slug);

  let prev: InternalSidebarLinkType | undefined;
  let next: InternalSidebarLinkType | undefined;
  if (linkIndex > 0) {
    prev = links[linkIndex - 1];
  }
  if (linkIndex < links.length - 1) {
    next = links[linkIndex + 1];
  }
  return { prev, next };
}

export async function resolveMarkdown(slug: string, contentDir: string) {
  const filePath = await getPathBySlug(slug, contentDir);
  const baseUrl = pathToFileURL(filePath).href;
  const file = await read(filePath);
  const frontmatter = await compileFrontmatter(file);
  const { code, toc } = await compileMarkdown(file, baseUrl);
  return { code, toc, frontmatter };
}

export async function resolveContent(
  id: string,
  linksMap: Map<string, InternalSidebarLinkType[]>,
  contentDir: string,
) {
  const slug = id.replace(CONTENT_VIRTUAL_ID, "").replace("\0", "");
  const base = slug.split("/")[0] as string;

  const { prev, next } = resolveSiblings(base, slug, linksMap);
  const { toc, code, frontmatter } = await resolveMarkdown(slug, contentDir);
  let resolvedCode = code;

  resolvedCode += `\n export const toc = ${JSON.stringify(toc)}\n`;
  resolvedCode += `\n export const prev = ${JSON.stringify(prev)}\n`;
  resolvedCode += `\n export const next = ${JSON.stringify(next)}\n`;
  resolvedCode += `\n export const frontmatter = ${JSON.stringify(
    frontmatter,
  )}\n`;
  return resolvedCode;
}

export async function getPathBySlug(slug: string, contentDir: string) {
  const pathMatch = join(contentDir, slug);
  const matches = await glob(`${pathMatch}.{md,mdx}`);
  if (matches.length === 0) {
    throw new PrestigeError(`[Prestige] Could not find markdown file for slug: "${slug}". Searched at: ${pathMatch}.{md,mdx}. If you want to link to a custom page, use 'link: "${slug}"' instead of 'slug: "${slug}"' in your collection config.`);
  }
  return matches[0] as string;
}

export async function getFileBySlug(slug: string, contentDir: string) {
  return await read(await getPathBySlug(slug, contentDir));
}

export function getVirtualModuleIdsForFile(path: string, contentDir: string) {
  const slug = getSlugByPath(path, contentDir);
  return ["\0" + CONTENT_VIRTUAL_ID + slug];
}

export function getSlugByPath(path: string, contentDir: string) {
  // 1. Get the relative path: "zz/zz/myFile.json"
  const relativePath = relative(contentDir, path);

  // 2. Parse the path to separate the extension
  const pathInfo = parse(relativePath);

  const result = join(pathInfo.dir, pathInfo.name);

  return result;
}
