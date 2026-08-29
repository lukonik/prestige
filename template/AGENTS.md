<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:

- Run `pnpm dlx @tanstack/intent@latest list` from the project root to inspect the permitted local skill catalog.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Load the most specific skill for the current concern. Load another only when the task crosses that boundary.
- Treat editor hooks as workflow assistance only. The `intent.skills` allowlist and `intent.exclude` rules in `package.json` decide which installed packages may surface guidance.
<!-- intent-skills:end -->
