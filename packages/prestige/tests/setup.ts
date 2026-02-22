import { vol } from "memfs";
import { beforeEach, vi } from "vitest";

// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock("node:fs");
vi.mock("node:fs/promises");
vi.mock("unconfig", async () => {
  return await import("./__mocks__/unconfig.cjs");
});

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset();
});
