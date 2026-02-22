import { createLogger } from "vite";

const logger = createLogger("info", {
  prefix: "[prestige]",
  allowClearScreen: true,
});

export default logger;
