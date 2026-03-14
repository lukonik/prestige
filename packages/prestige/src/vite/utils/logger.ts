import pc from "picocolors";
export interface Logger {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export function createLogger(config: {
  disabled: boolean;
  debug: boolean;
}): Logger {
  function formatLogArgs(message: string) {
    const now = new Date();

    // Format: 11:14:22 PM
    const timestamp = now.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Vite's signature: Gray timestamp + Bold Cyan tag
    const fullMessage = `${pc.dim(timestamp)} ${pc.bold(pc.cyan("[prestige]"))} ${message}`;
    return fullMessage;
  }

  return {
    debug: (message: string) => {
      if (!config.disabled && config.debug)
        console.debug(formatLogArgs(pc.gray(message)));
    },
    info: (message: string) => {
      if (!config.disabled) console.info(formatLogArgs(pc.reset(message)));
    },
    warn: (message: string) => {
      if (!config.disabled) console.warn(formatLogArgs(pc.yellow(message)));
    },
    error: (message: string) => {
      if (!config.disabled) console.error(formatLogArgs(pc.red(message)));
    },
  };
}

export default createLogger;
