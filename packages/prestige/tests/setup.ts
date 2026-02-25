import { remove } from "fs-extra";
import { afterEach, beforeEach, chai, vi } from "vitest";
import { getTempDir } from "./vite/test-utils";
import { vol } from "memfs";

chai.config.truncateThreshold = 1000;

// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock("node:fs", async () => {
  const memfs = await import("memfs");
  return { ...memfs.fs, default: memfs.fs };
});
vi.mock("node:fs/promises", async () => {
  const memfs = await import("memfs");
  return { ...memfs.fs.promises, default: memfs.fs.promises };
});
vi.mock("fs", async () => {
  const memfs = await import("memfs");
  return { ...memfs.fs, default: memfs.fs };
});
vi.mock("fs/promises", async () => {
  const memfs = await import("memfs");
  return { ...memfs.fs.promises, default: memfs.fs.promises };
});
vi.mock("graceful-fs", async () => {
  const memfs = await import("memfs");
  return { ...memfs.fs, default: memfs.fs };
});

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset();
});

afterEach(async () => {
  await remove(getTempDir());
});
