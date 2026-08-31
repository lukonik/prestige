import { defineConfig } from "@prestigia/docs/vite";

export default defineConfig({
  sidebar: [
    {
      label: "Package",
      items: ["overview"],
    },
    {
      label: "Skills",
      items: ["agent-skills"],
    },
    {
      label: "Workflow",
      items: ["release-workflow"],
    },
  ],
});
