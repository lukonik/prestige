---
name: content-authoring
description: >
  Preserve the Prestige v0.0.3 Markdown, MDX, and collection contract during the rebuild. Load for src/content, page frontmatter, internal slugs, external links, nested groups, autogenerate, sidebar labels, sibling navigation, or generated content routes.
metadata:
  type: sub-skill
  library: "@prestigia/docs"
  library_version: 0.0.3
requires:
  - prestige-core
sources:
  - lukonik/prestigia:docs/agent-skills.md
---

# Prestige Content Authoring

> Rebuild status: this is versioned contract guidance for reimplementation;
> the current placeholder package does not yet compile content routes.

Read `prestige-core/SKILL.md` first if the plugin and app-root config are not already installed.

## Add a Page

The collection slug is relative to `src/content` and omits the `.md` or `.mdx` extension.

```ts
// prestige.config.ts
import { defineConfig } from "@prestigia/docs/vite";

export default defineConfig({
  title: "My documentation",
  collections: [
    {
      id: "docs",
      items: [{ label: "Quick start", slug: "docs/quick-start" }],
    },
  ],
});
```

```md
<!-- src/content/docs/quick-start.mdx -->

---

title: Quick start
description: Install and configure the project.
label: Start here
---

# Quick start
```

This generates `/docs/quick-start` and the corresponding files under `src/routes/(prestige)`.

## Collection Patterns

Use an internal item for Prestige content, an external item for an existing route or URL, and a group for pathless sidebar structure:

```ts
items: [
  { label: "Introduction", slug: "docs/introduction" },
  {
    label: "Guides",
    collapsed: false,
    items: [
      { label: "Configuration", slug: "docs/guides/configuration" },
      { label: "Status", link: "/status" },
    ],
  },
  { label: "React", link: "https://react.dev" },
];
```

Use directory generation when the filesystem should define a whole group:

```ts
items: [
  {
    label: "Guides",
    autogenerate: { directory: "guides" },
  },
];
```

The directory is relative to the collection root, so this example scans `src/content/<collection-id>/guides`.

## Frontmatter

`title` is required. `description` and `label` are optional. Use `head` for extra TanStack Router head entries:

```md
---
title: Deployment
description: Deploy the documentation site.
head:
  meta:
    - property: og:type
      content: article
  links:
    - rel: canonical
      href: https://example.com/docs/deployment
---
```

Head arrays accept router-compatible record objects under `meta`, `links`, `styles`, and `scripts`.

## Common Mistakes

### Including a leading slash or file extension in `slug`

Use `docs/quick-start`, not `/docs/quick-start.mdx`. Prestige resolves the extension.

### Mismatching the collection ID and directory

`id: "docs"` reads `src/content/docs`. Keep those names aligned.

### Expecting an external item to compile content

An item with `link` is navigation only. Prestige neither generates nor validates its target.

### Combining `items` and `autogenerate` casually

Choose explicit children or directory generation for a group. If both are set, explicit `items` take precedence.

### Editing `(prestige)` after changing navigation

Change `prestige.config.ts` or the content source, then let the plugin regenerate routes and navigation.
