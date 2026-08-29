# Agent Skills

`@prestigia/docs` ships Agent Skills in its npm tarball. The guidance is
versioned with the package so an agent can load instructions that match the
Prestigia v0.0.3 contract.

The repository is currently a clean-slate package shell. These skills preserve
the previous contract as a rebuild reference; they do not claim that the Vite,
content, or UI exports are already implemented in the placeholder package.

## Trust installed guidance explicitly

TanStack Intent discovers package metadata and static files from installed
dependencies. It does not import or execute a discovered package entry point,
binary, lifecycle script, or other package code while scanning and loading
skills.

Discovery is not trust. Configure the packages that may surface guidance:

```json
{
  "intent": {
    "skills": ["@prestigia/docs", "@tanstack/*"],
    "exclude": ["@tanstack/*devtools*", "*#experimental-*"]
  }
}
```

## Discover, then load for the task

```sh
pnpm dlx @tanstack/intent@latest list
pnpm dlx @tanstack/intent@latest load @prestigia/docs#prestigia-core
pnpm dlx @tanstack/intent@latest load @prestigia/docs#prestigia-core/content-authoring
pnpm dlx @tanstack/intent@latest load @prestigia/docs#prestigia-core/shell-customization
```

Load only the narrowest guidance for the current task. During the rebuild,
verify the referenced export exists before using it as an implemented API.

## Maintainer checks

```sh
pnpm skills:validate
pnpm skills:stale
pnpm skills:pack
```

CI validates the Agent Skills format, verifies every `SKILL.md` is present in
the npm dry-run tarball, and reports when a referenced source changes without
a corresponding skill review.
