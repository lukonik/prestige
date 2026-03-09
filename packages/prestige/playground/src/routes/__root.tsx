import { createPrestigeRootRoute } from "@lonik/prestige/ui";
import favicon from "../assets/favicon.ico";
import appCss from "../styles.css?url";

export const Route = createPrestigeRootRoute({
  appCss,
  title: "Prestige",
  favicon: favicon,
});
