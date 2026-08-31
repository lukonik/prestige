declare module "virtual:prestigia/config" {
  import type { ResolvedPrestigiaConfig } from "@prestigia/docs/vite";

  const config: ResolvedPrestigiaConfig;

  export const sidebar: ResolvedPrestigiaConfig["sidebar"];
  export default config;
}
