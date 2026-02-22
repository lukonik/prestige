import { afterEach, describe, expect, it, vi } from "vitest";
import logger from "../../../src/vite/utils/logger";

describe("logger", () => {
  function createInfoSpy(level: "info" | "warn" | "error") {
    return vi.spyOn(console, level).mockImplementation(() => {});
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should info the message", () => {
    const logSpy = createInfoSpy("info");
    logger.info("Info Message");
    expect(logSpy).toHaveBeenCalledWith("[prestige]: Info Message");
  });
  it("should warn the message", () => {
    const logSpy = createInfoSpy("warn");
    logger.warn("Warning Message");
    expect(logSpy).toHaveBeenCalledWith("[prestige]: Warning Message");
  });
  it("should error the message", () => {
    const logSpy = createInfoSpy("error");
    logger.error("This is error");
    expect(logSpy).toHaveBeenCalledWith("[prestige]: This is error");
  });
});
