---
name: prestigia-core
description: >
  Build SSG-first Prestigia sites with the current @prestigia/docs Article, Doc, Docs, Sidebar, createDocRoute, and createDocsRoute APIs or preserve the former v0.0.3 TanStack Start and Vite contract while rebuilding the package. Load for Markdown, static document-route rendering, documentation sidebars, Content Collections, prestigia(), defineConfig(), prestigia.config.ts, src/content, generated (prestigia) routes, plugin ordering, or initial project structure; load a narrower sub-skill for content authoring or shell customization.
metadata:
  type: core
  library: "@prestigia/docs"
  library_version: 0.0.3
sources:
  - lukonik/prestigia:docs/agent-skills.md
  - lukonik/prestigia:packages/docs/README.md
---

# Prestigia Core

> Rebuild status: `Article`, `Doc`, `Docs`, `createDocRoute`, and
> `createDocsRoute` are current package exports. The Vite plugin,
> configuration, generated routes, and application shell guidance below
> preserve the former v0.0.3 contract as implementation guidance; verify
> those exports exist before treating them as currently available.

Prestigia is a documentation framework layered onto TanStack Start. Its Vite plugin reads Markdown and MDX from `src/content`, validates `prestigia.config.ts`, builds navigation, and generates TanStack Router files under `src/routes/(prestigia)`.

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
import { createDocsRoute, mapDocumentsToSidebar } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

const sidebar = mapDocumentsToSidebar(allDocs);

export const Route = createFileRoute("/docs")(createDocsRoute({ sidebar }));
```

`createDocsRoute` renders `Docs`, marks the current entry, uses TanStack
Router links for internal destinations, and places the child route in its
outlet. `mapDocumentsToSidebar` converts Content Collections documents using
`_meta.path` and `title` into link items and can group them with `groupBy`. The
recursive `Sidebar` component and its `SidebarItem` types are exported from
`@prestigia/docs`; use its `renderLink` prop when a layout is owned outside
`createDocsRoute`.

## Load the Narrowest Guidance

| Current task                                                             | Load                                          |
| ------------------------------------------------------------------------ | --------------------------------------------- |
| Render Markdown or create documentation and document routes              | This skill only                               |
| Install Prestigia, register plugins, or edit `prestigia.config.ts`       | This skill only                               |
| Add pages, frontmatter, collections, groups, or autogenerated navigation | `prestigia-core/content-authoring/SKILL.md`   |
| Mount or customize `PrestigiaShell`, header links, search, or footer     | `prestigia-core/shell-customization/SKILL.md` |

Do not load both sub-skills unless the task changes both content structure and the application shell.

## Minimum Setup

Register `prestigia()` before the TanStack Start plugin. Keep the React plugin after TanStack Start.

```ts
// vite.config.ts
import { prestigia } from "@prestigia/docs/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
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
  title: "My documentation",
  collections: [
    {
      id: "docs",
      items: [{ label: "Introduction", slug: "docs/introduction" }],
    },
  ],
});
```

```md
<!-- src/content/docs/introduction.mdx -->

---

title: Introduction
---

# Introduction
```

## Configuration Boundaries

- Put `disableLog` and `enableDebugLog` on `prestigia()` in `vite.config.ts`.
- Put `title`, `github`, `algolia`, `license`, `collections`, and `markdown` in `prestigia.config.ts`.
- `src/content` is fixed relative to the Vite app root. A collection `id` must match its top-level content directory.
- A content file becomes a generated route only when a collection item references it or an `autogenerate` group discovers it.
- Treat `src/routes/(prestigia)` exactly like `routeTree.gen.ts`: generated output that may be replaced.

## Common Mistakes

### Registering Prestigia after TanStack Start

Prestigia must compile content and routes before TanStack Start consumes the route tree. Keep `prestigia()` earlier in the Vite plugin list.

### Putting site config on `prestigia()`

`prestigia()` accepts only logging options. Site structure and Markdown pipeline options belong in `prestigia.config.ts`.

### Editing generated route files

Changes under `src/routes/(prestigia)` are not durable. Change the source Markdown, collection config, or shell instead.

### Creating an unregistered page

A Markdown file on disk is not enough. Add its slug to a collection or place it below a configured `autogenerate.directory`.

## Version

Targets `@prestigia/docs` v0.0.3.
