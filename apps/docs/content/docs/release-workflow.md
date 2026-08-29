---
title: "Release workflow"
description: "Prepare package changes, changesets, builds, and publication from one workflow."
topic: "workflow"
order: 3
---

## Changesets

Add a changeset for every user-visible package change and describe the released behavior in product language.

Versioning updates package versions and changelogs before the publish command builds every package.

## Verification

The CI workflow checks formatting, types, lint rules, library tests, package metadata, and production output.

A successful production build is required because it also verifies server and client environment boundaries for this app.
