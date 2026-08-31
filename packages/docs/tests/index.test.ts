import { describe, expect, it } from "vitest";

import {
  Doc,
  Docs,
  Sidebar,
  createDocRoute,
  createDocsRoute,
  mapDocumentsToSidebar,
  packageName,
} from "../src/index.js";

describe("@prestigia/docs", () => {
  it("retains its public package identity", () => {
    expect(packageName).toBe("@prestigia/docs");
  });

  it("exports the document route primitives", () => {
    expect(Doc).toBeTypeOf("function");
    expect(Docs).toBeTypeOf("function");
    expect(Sidebar).toBeTypeOf("function");
    expect(createDocRoute).toBeTypeOf("function");
    expect(createDocsRoute).toBeTypeOf("function");
    expect(mapDocumentsToSidebar).toBeTypeOf("function");
  });
});
