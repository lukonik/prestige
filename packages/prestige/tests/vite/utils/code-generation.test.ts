import { describe, expect, it } from "vitest";
import {
  genExportDefault,
  genExportUndefined,
} from "../../../src/vite/utils/code-generation";

describe("codeGeneration", () => {
  describe("genExportDefault", () => {
    it("should generate export default", () => {
      expect(genExportDefault("foo")).toBe("export default foo;");
    });
  });
  describe("genExportUndefined", () => {
    it("should generate export default undefined", () => {
      expect(genExportUndefined()).toBe("export default undefined;");
    });
  });
});
