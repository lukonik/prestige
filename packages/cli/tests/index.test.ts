import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  createProject,
  defaultProjectDirectory,
  main,
  packageName,
} from "../src/index.js";

describe("@prestigia/cli", () => {
  it("retains its public package identity", () => {
    expect(packageName).toBe("@prestigia/cli");
  });

  it("documents the create command", async () => {
    await expect(main([])).resolves.toContain("prestigia create [directory]");
  });

  it("creates a renamed project from the bundled template", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "prestigia-cli-"));
    const destination = await createProject({
      cwd,
      directory: "My Docs",
    });
    const generatedPackageJson = JSON.parse(
      await readFile(path.join(destination, "package.json"), "utf8"),
    ) as { name: string };

    expect(generatedPackageJson.name).toBe("my-docs");
    await expect(
      readFile(path.join(destination, ".gitignore"), "utf8"),
    ).resolves.toContain(".content-collections");
    await expect(
      readFile(path.join(destination, "components.json"), "utf8"),
    ).resolves.toContain('"style": "base-nova"');
    await expect(
      readFile(path.join(destination, "content-collections.ts"), "utf8"),
    ).resolves.toContain("defineCollection");
  });

  it("refuses to overwrite a non-empty destination", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "prestigia-cli-"));
    const destination = path.join(cwd, defaultProjectDirectory);

    await mkdir(destination);
    await writeFile(path.join(destination, "keep.txt"), "keep me", "utf8");

    await expect(createProject({ cwd })).rejects.toThrow("is not empty");
  });
});
