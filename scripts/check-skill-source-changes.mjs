import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argumentsWithoutSeparator = process.argv
  .slice(2)
  .filter((arg) => arg !== "--");
const explicitBase = argumentsWithoutSeparator[0];
const explicitHead = argumentsWithoutSeparator[1];

function git(args) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function findSkillFiles(directory) {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSkillFiles(path));
    } else if (entry.name === "SKILL.md") {
      files.push(path);
    }
  }
  return files;
}

function parseSources(skillFile) {
  const content = readFileSync(skillFile, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] ?? "";
  const lines = frontmatter.split(/\r?\n/u);
  const sources = [];
  let inSources = false;

  for (const line of lines) {
    if (/^sources:\s*$/u.test(line)) {
      inSources = true;
      continue;
    }
    if (inSources && /^\S/u.test(line)) break;
    if (!inSources) continue;

    const source = line.match(/^\s+-\s+['"]?([^'"]+?)['"]?\s*$/u)?.[1];
    if (source) sources.push(source);
  }

  return sources;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

function readJsonAtRevision(revision, repositoryPath) {
  try {
    return JSON.parse(git(["show", `${revision}:${repositoryPath}`]));
  } catch {
    return {};
  }
}

function sourcePath(source) {
  const separator = source.indexOf(":");
  return separator === -1 ? source : source.slice(separator + 1);
}

function toRepositoryPath(path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

function resolveBase() {
  if (explicitBase) return explicitBase;

  const githubBase = process.env.GITHUB_BASE_REF;
  if (githubBase) return `origin/${githubBase}`;

  return git(["rev-parse", "HEAD"]);
}

const base = resolveBase();
const diffTarget = explicitHead ? `${base}...${explicitHead}` : base;
const changedFiles = new Set(
  git(["diff", "--name-only", "--diff-filter=ACMRD", diffTarget])
    .split("\n")
    .filter(Boolean),
);
if (!explicitHead) {
  for (const untrackedFile of git([
    "ls-files",
    "--others",
    "--exclude-standard",
  ])
    .split("\n")
    .filter(Boolean)) {
    changedFiles.add(untrackedFile);
  }
}

const packageDirectories = readdirSync(join(repositoryRoot, "packages"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(repositoryRoot, "packages", entry.name));

const staleSkills = [];
for (const packageDirectory of packageDirectories) {
  const skillsDirectory = join(packageDirectory, "skills");
  const syncState = toRepositoryPath(join(skillsDirectory, "sync-state.json"));
  const currentSyncState = readJson(join(repositoryRoot, syncState));
  const baseSyncState = readJsonAtRevision(base, syncState);

  for (const skillFile of findSkillFiles(skillsDirectory)) {
    const skillPath = toRepositoryPath(skillFile);
    const skillName = relative(skillsDirectory, dirname(skillFile))
      .split(sep)
      .join("/");
    const changedSources = parseSources(skillFile).filter((source) =>
      changedFiles.has(sourcePath(source)),
    );
    const unreviewedSources = changedSources.filter((source) => {
      if (changedFiles.has(skillPath)) return false;

      const previousSha =
        baseSyncState.skills?.[skillName]?.sources_sha?.[source];
      const currentSha =
        currentSyncState.skills?.[skillName]?.sources_sha?.[source];
      return !currentSha || currentSha === previousSha;
    });

    if (unreviewedSources.length > 0) {
      staleSkills.push({
        skillPath,
        changedSources: unreviewedSources.map(sourcePath),
      });
    }
  }
}

if (staleSkills.length > 0) {
  console.error("Referenced documentation changed without a recorded skill review:\n");
  for (const { skillPath, changedSources } of staleSkills) {
    console.error(`- ${skillPath}`);
    for (const changedSource of changedSources) {
      console.error(`  - ${changedSource}`);
    }
  }
  console.error(
    "\nReview the source diff. Update the affected SKILL.md when guidance changed, or update its sources_sha entry in skills/sync-state.json to record a no-content-change review.",
  );
  process.exitCode = 1;
} else {
  console.log("Referenced documentation changes have corresponding skill review records.");
}
