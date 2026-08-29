---
title: "Prestigia overview"
description: "Understand the repository layout, package boundaries, and shared conventions."
topic: "package"
order: 1
---

## Workspace

Prestigia is a pnpm and Nx workspace. Publishable libraries live in packages, while deployable products live in apps.

Shared dependency versions are declared in the root pnpm catalog so every project resolves the same toolchain.

## Quality gates

Formatting, ESLint, TypeScript, package tests, and production builds are orchestrated from the workspace root.

Run the narrow project checks while iterating, then run the root CI command before merging.
