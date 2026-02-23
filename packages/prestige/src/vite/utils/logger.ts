import pc from "picocolors";

function print(log: string, logLevel: "info" | "warning" | "error") {
  const message = `[prestige]: ${log}`;

  switch (logLevel) {
    case "info":
      console.info(pc.blue(message));
      break;
    case "warning":
      console.warn(pc.yellow(message));
      break;
    case "error":
      console.error(pc.red(message));
      break;
  }
}

export default {
  info: (message: string) => print(message, "info"),
  warn: (message: string) => print(message, "warning"),
  error: (message: unknown) => {
    if (message instanceof Error) {
      console.error(message.message);
    } else if (typeof message === "string") {
      print(message, "error");
    } else {
      print(JSON.stringify(message), "error");
    }
  },
};
