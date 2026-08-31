---
name: prestigia-core
description: >
  Build SSG-first Prestigia sites with the current @prestigia/docs rendering, route, sidebar, and Vite config APIs, or preserve the former generated-route and shell contract while rebuilding the package. Load for Markdown, static document-route rendering, documentation sidebars, Content Collections, prestigia(), defineConfig(), prestigia.config.ts, virtual:prestigia/config, plugin ordering, or initial project structure; load a narrower sub-skill for content authoring or shell customization.
metadata:
  type: core
  library: "@prestigia/docs"
  library_version: 0.8.0
sources:
  - lukonik/prestigia:docs/agent-skills.md
  - lukonik/prestigia:packages/docs/README.md
---

# Prestigia Core

> Rebuild status: `Article`, `Doc`, `Docs`, `createDocRoute`,
> `createDocsRoute`, `prestigia`, and Prestigia config/sidebar resolution are
> current package exports. Generated routes and application shell guidance
> preserve the former v0.0.3 contract as implementation guidance; verify
> those exports exist before treating them as currently available.

Prestigia is a documentation framework layered onto TanStack Start. Its
current Vite plugin loads and watches `prestigia.config.ts`, then exposes
configuration merged with Content Collections' generated `allDocs` through
`virtual:prestigia/config`. It does not currently generate content or route
files.

## SSG-First Contract

Prestigia documentation sites are static by default. Import Content
Collections' `allDocs` directly, derive navigation at module/build time, and
enable TanStack Start prerendering. Do not introduce `createServerFn`,
server-only document stores, or forced `ssr: true` route options for standard
documentation. If an application needs runtime SSR later, its owner adds that
capability outside the Prestigia helpers.

## Render an Article

Pass raw Markdown or a pre-parsed TanStack Markdown document to the current
`Article` export:

```tsx
import { Article } from "@prestigia/docs";

export function Documentation({ content }: { content: string }) {
  return <Article content={content} />;
}
```

`Article` renders a semantic `<article>` with heading IDs, TanStack Markdown,
and a selective TanStack Highlight setup. It includes GitHub light and dark
code themes; the dark theme activates below a `.dark` ancestor.

Customize the rendering boundary instead of preprocessing the Markdown:

- Pass native article attributes such as `className` and `aria-labelledby`
  directly to `Article`.
- Use `markdownOptions` for custom components, line numbers, heading behavior,
  HTML handling, or TanStack Markdown extensions.
- Pass `highlighter` or `themeCss` to replace the defaults. Set either to
  `false` when the application owns that concern.
- Treat custom highlighter output as trusted HTML. Escape untrusted source or
  use TanStack Highlight's Markdown adapter.

## Create a Document Route

Use `createDocRoute` as the options argument to TanStack Router's required
`createFileRoute` call. Pass the static Content Collections documents
directly; each document supplies `title`, `description`, Markdown `content`,
and `_meta.path`.

```tsx
import { createDocRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

export const Route = createFileRoute("/docs/$slug")(
  createDocRoute({ documents: allDocs }),
);
```

The helper selects by `_meta.path`, creates title and description metadata,
and renders `Doc`. It does not force SSR. Configure the default page through
`docProps`, use `siteName` or `fallbackTitle` for metadata, or pass `render`
for a custom page boundary. Use `Doc` directly when routing is owned elsewhere.

## Create the Documentation Layout Route

Add a `docs.tsx` file route next to `docs.$slug.tsx` when all document pages
should share a sidebar. TanStack Router nests the slug route below this parent
without changing its `/docs/$slug` URL.

```tsx
import { createDocsRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import config from "virtual:prestigia/config";

export const Route = createFileRoute("/docs")(
  createDocsRoute({ sidebar: config.sidebar }),
);
```

`createDocsRoute` renders `Docs`, marks the current entry, uses TanStack
Router links for internal destinations, and places the child route in its
outlet. The virtual config resolves authored navigation against Content
Collections titles and paths. The recursive `Sidebar` component and its
`SidebarItem` types are exported from `@prestigia/docs`; use its `renderLink`
prop when a layout is owned outside `createDocsRoute`.

## Load the Narrowest Guidance

| Current task                                                             | Load                                          |
| ------------------------------------------------------------------------ | --------------------------------------------- |
| Render Markdown or create documentation and document routes              | This skill only                               |
| Install Prestigia, register plugins, or edit `prestigia.config.ts`       | This skill only                               |
| Add pages, frontmatter, collections, groups, or autogenerated navigation | `prestigia-core/content-authoring/SKILL.md`   |
| Mount or customize `PrestigiaShell`, header links, search, or footer     | `prestigia-core/shell-customization/SKILL.md` |

Do not load both sub-skills unless the task changes both content structure and the application shell.

## Minimum Setup

Register Content Collections before `prestigia()`, and register `prestigia()`
before the TanStack Start plugin. Keep the React plugin after TanStack Start.

```ts
// vite.config.ts
import contentCollections from "@content-collections/vite";
import { prestigia } from "@prestigia/docs/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    contentCollections(),
    prestigia(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => !/[?#]/u.test(path),
      },
    }),
    viteReact(),
  ],
});
```

Create the required app-root config and content directory:

```ts
// prestigia.config.ts
import { defineConfig } from "@prestigia/docs/vite";

export default defineConfig({
  sidebar: [
    "introduction",
    {
      label: "Guides",
      items: [{ autogenerate: { directory: "guides" } }],
    },
  ],
});
```

```md
<!-- content/docs/introduction.md -->

---

title: Introduction
---

# Introduction
```

The application must include an ambient declaration for
`virtual:prestigia/config`; the CLI template provides
`src/prestigia-env.d.ts`.

## Configuration Boundaries

- `prestigia()` accepts the optional config file location; authored navigation
  belongs in `prestigia.config.ts`.
- Register and configure Content Collections separately. The virtual module
  imports its generated `allDocs` export instead of reparsing frontmatter.
- Sidebar entries support slug strings, `{ slug, label? }` objects, links,
  recursive groups, collapsed groups, and directory autogeneration.
- Document-backed entries inherit their label from Content Collections unless
  configuration overrides it. Unknown configured slugs fail clearly.
- Omitting `sidebar` generates filesystem-shaped navigation from all documents.

## Common Mistakes

### Registering Prestigia before Content Collections or after TanStack Start

Content Collections must provide `allDocs` for the virtual module, and TanStack
Start must consume the resolved module. Keep the order shown in Minimum Setup.

### Putting site config on `prestigia()`

`prestigia()` only selects how the config file is loaded. Site structure
belongs in `prestigia.config.ts`.

### Importing the authored config directly in a route

Import `virtual:prestigia/config`, not `prestigia.config.ts`. The virtual module
contains the sidebar resolved against current Content Collections documents
and updates when the config or one of its imported dependencies changes.

### Expecting the plugin to generate document routes

The current plugin resolves navigation only. Keep the `/docs/$slug` route and
its direct `allDocs` import; use `createDocRoute` for the current route helper.

## Version

Targets the current `@prestigia/docs` v0.8.0 rendering, route-helper, and Vite
config APIs. Explicitly marked generated-route and shell guidance preserves the
former v0.0.3 contract.
