import { pathToFileURL } from "node:url";
import { join, parse, relative } from "pathe";
import { glob } from "tinyglobby";
import { read } from "to-vfile";
import {
  SiblingNavigationType,
  SidebarLinkType,
} from "../core/content/content.types";
import { compileMarkdown } from "./content-compiler";

import { PrestigeError } from "../utils/errors";
import { Logger } from "../utils/logger";
import { compileFrontmatter } from "./content-compiler";

export const CONTENT_VIRTUAL_ID = "virtual:prestige/content/";

function getSiblingLink(
  link: SidebarLinkType | undefined,
): SiblingNavigationType | undefined {
  if (!link) {
    return undefined;
  }
  return {
    label: link.label,
    link: "slug" in link ? link.slug : link.link,
  };
}

export function resolveSiblings(
  base: string,
  slug: string,
  linksMap: Map<string, SidebarLinkType[]>,
) {
  const links = linksMap.get(base);
  if (!links?.length) {
    return { prev: undefined, next: undefined };
  }

  const validLinks = links.filter((l) => {
    if ("slug" in l) return true;
    if ("link" in l) {
      return !l.link.startsWith("http://") && !l.link.startsWith("https://");
    }
    return false;
  });

  const linkIndex = validLinks.findIndex((link) => {
    return (
      ("slug" in link && link.slug === slug) ||
      ("link" in link && link.link === slug)
    );
  });

  let prev: SiblingNavigationType | undefined;
  let next: SiblingNavigationType | undefined;

  if (linkIndex !== -1) {
    if (linkIndex > 0) {
      prev = getSiblingLink(validLinks[linkIndex - 1]);
    }
    if (linkIndex < validLinks.length - 1) {
      next = getSiblingLink(validLinks[linkIndex + 1]);
    }
  }

  return { prev, next };
}

export async function resolveMarkdown(slug: string, contentDir: string) {
  const filePath = await getPathBySlug(slug, contentDir);
  const baseUrl = pathToFileURL(filePath).href;
  const file = await read(filePath);
  const frontmatter = await compileFrontmatter(file);
  const { data, error } = await compileMarkdown(file, baseUrl);
  return { code: data?.code, toc: data?.toc, frontmatter, error };
}

export async function resolveContent(
  id: string,
  linksMap: Map<string, SidebarLinkType[]>,
  contentDir: string,
  logger: Logger,
) {
  const slug = id.replace(CONTENT_VIRTUAL_ID, "").replace("\0", "");
  const base = slug.split("/")[0] as string;

  const { prev, next } = resolveSiblings(base, slug, linksMap);
  const { toc, code, frontmatter, error } = await resolveMarkdown(
    slug,
    contentDir,
  );

  if (error) {
    logger.error(
      `\n🚨 Compile Error\n` +
        `File: ${error.file || "Unknown file"}\n` +
        `Message: ${error.message || String(error)}\n` +
        (error.snippet ? `\n${error.snippet}\n` : ""),
    );
  }

  let resolvedCode = code || "";

  resolvedCode += `\n export const toc = ${JSON.stringify(toc)}\n`;
  resolvedCode += `\n export const prev = ${JSON.stringify(prev)}\n`;
  resolvedCode += `\n export const next = ${JSON.stringify(next)}\n`;
  resolvedCode += `\n export const frontmatter = ${JSON.stringify(
    frontmatter,
  )}\n`;
  resolvedCode += `\n export const error = ${JSON.stringify(error)}\n`;
  return resolvedCode;
}

export async function getPathBySlug(slug: string, contentDir: string) {
  const pathMatch = join(contentDir, slug);
  const matches = await glob(`${pathMatch}.{md,mdx}`);
  if (matches.length === 0) {
    throw new PrestigeError(
      `[Prestige] Could not find markdown file for slug: "${slug}". Searched at: ${pathMatch}.{md,mdx}. If you want to link to a custom page, use 'link: "${slug}"' instead of 'slug: "${slug}"' in your collection config.`,
    );
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
