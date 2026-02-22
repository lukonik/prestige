import { remove } from "fs-extra";
import { afterEach, chai } from "vitest";
import { getTempDir } from "./vite/test-utils";

chai.config.truncateThreshold = 1000;

afterEach(async () => {
  await remove(getTempDir());
});
