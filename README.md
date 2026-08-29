# Prestigia

This repository is a clean TypeScript package monorepo built from the visible
pieces of the TanStack Config maintenance model. TanStack Config is treated as
shared packages and conventions, not as an audit command or hidden framework.

The previous product implementation, documentation site, starter template,
semantic-release setup, and generated artifacts were intentionally removed.
The two existing npm identities and their published versions were retained:

- `@prestigia/docs` at `0.0.3`
- `@prestigia/cli` at `0.7.0`

## Toolchain

- pnpm workspaces and a central version catalog
- `@tanstack/eslint-config` through the ESLint flat config
- `tsdown` for ESM package builds and declarations
- Nx as an npm-script task runner for affected execution and caching
- Vitest, Publint, and Are the Types Wrong for source and tarball checks
- `pkg-pr-new` for installable pull-request previews
- Changesets for reviewed version intent, changelogs, and releases
- npm trusted publishing through GitHub OIDC; no npm token is referenced

The current TanStack guidance recommends `tsdown` for future TypeScript package
builds. `@tanstack/vite-config` is therefore not installed; it remains a legacy
option for repositories that specifically need TanStack's old dual-build Vite
helpers.

TypeScript is pinned to `6.0.2`, rather than the registry's newer `7.0.2`,
because the parser shipped by the current maintained TanStack ESLint config
supports TypeScript versions below `6.1`. The other tool versions live in
[`pnpm-workspace.yaml`](./pnpm-workspace.yaml) and are intentionally visible.

## Commands

```sh
pnpm install
pnpm test:pr       # format + Nx affected lint, types, tests, build, package checks
pnpm test:ci       # the same targets for every package
pnpm build         # affected packages only
pnpm build:all     # every package
pnpm changeset     # record release intent in a pull request
pnpm preview       # build and publish pkg-pr-new previews
```

Nx discovers package targets from each package's scripts. Cache inputs,
outputs, and build dependencies are declared in [`nx.json`](./nx.json).

## Publishing setup

The release workflow has `id-token: write` and deliberately contains no npm
credential. Before the first automated publish, configure a trusted publisher
for both npm packages with these values:

- organization or user: `lukonik`
- repository: `prestigia`
- workflow filename: `release.yml`
- environment: leave empty unless the workflow is updated to use one

GitHub repository settings must also allow Actions to create pull requests.
Merging normal changes with changesets creates or updates the
`chore: version packages` pull request. Merging that pull request publishes
with short-lived OIDC credentials and provenance.
