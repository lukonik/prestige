import { createPrestigeRootRoute } from "@lonik/prestige/ui";
import favicon from "../assets/favicon.ico";
import appCss from "../styles.css?url";

export const Route = createPrestigeRootRoute({
  appCss,
  title: "Prestige",
  favicon: favicon,
  github: "https://github.com/lukonik/Prestige",
  license: {
    label: "MIT License",
    url: "https://opensource.org/licenses/MIT",
  },
});
