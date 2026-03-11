import { afterEach, describe, expect, it, vi } from "vitest";
import logger from "../../../src/vite/utils/logger";

vi.unmock("../../../src/vite/utils/logger");

vi.mock("picocolors", () => ({
  default: {
    blue: (str: string) => str,
    yellow: (str: string) => str,
    red: (str: string) => str,
  },
}));

describe("logger", () => {
  function createInfoSpy(level: "info" | "warn" | "error") {
    const method = level === "info" ? "log" : level;
    return vi.spyOn(console, method).mockImplementation(() => {});
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should info the message", () => {
    const logSpy = createInfoSpy("info");
    logger.info("Info Message");
    expect(logSpy).toHaveBeenCalledWith("Info Message");
  });
  it("should warn the message", () => {
    const logSpy = createInfoSpy("warn");
    logger.warn("Warning Message");
    expect(logSpy).toHaveBeenCalledWith("Warning Message");
  });
  it("should error the message", () => {
    const logSpy = createInfoSpy("error");
    logger.error("This is error");
    expect(logSpy).toHaveBeenCalledWith("This is error");
  });
});

