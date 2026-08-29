import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";

const packageRoot = process.cwd();
const skillsRoot = join(packageRoot, "skills");

function findSkillFiles(directory) {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSkillFiles(path));
    } else if (entry.name === "SKILL.md") {
      files.push(relative(packageRoot, path).split(sep).join("/"));
    }
  }
  return files.sort();
}

const expectedSkills = findSkillFiles(skillsRoot);
if (expectedSkills.length === 0) {
  throw new Error(`No SKILL.md files found below ${skillsRoot}`);
}

const npmCache = mkdtempSync(join(tmpdir(), "prestigia-npm-pack-"));
let packOutput;
try {
  packOutput = execFileSync(
    "npm",
    ["pack", "--dry-run", "--json", "--ignore-scripts"],
    {
      cwd: packageRoot,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: npmCache },
      stdio: ["ignore", "pipe", "inherit"],
    },
  );
} finally {
  rmSync(npmCache, { recursive: true, force: true });
}
const packResult = JSON.parse(packOutput);
const packedFiles = new Set(
  packResult[0]?.files?.map((file) => file.path) ?? [],
);
const missingSkills = expectedSkills.filter((skill) => !packedFiles.has(skill));

if (missingSkills.length > 0) {
  console.error("The npm tarball is missing Agent Skills:");
  for (const skill of missingSkills) console.error(`- ${skill}`);
  process.exitCode = 1;
} else {
  console.log(
    `npm tarball includes all ${expectedSkills.length} Agent Skills.`,
  );
}
