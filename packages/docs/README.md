# @prestigia/docs

Prestigia is SSG-first. Content Collections data is imported directly and
documentation pages are generated during the application build. The package
does not create server functions or force runtime SSR.

Render documentation Markdown with TanStack Markdown and TanStack Highlight:

```tsx
import { Article } from "@prestigia/docs";

export function Documentation({ content }: { content: string }) {
  return <Article content={content} />;
}
```

`Article` accepts native `<article>` attributes. Use `markdownOptions` to
replace rendered elements, configure heading IDs, enable line numbers, or pass
TanStack Markdown extensions. Pass a custom `highlighter` and `themeCss`, or
set either option to `false`, to own code rendering and presentation.

For a complete TanStack Router document page, pass Content Collections'
`allDocs` directly to `createDocRoute` in the slug route:

```tsx
import { createDocRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

export const Route = createFileRoute("/docs/$slug")(
  createDocRoute({ documents: allDocs }),
);
```

The helper selects the matching static document by `_meta.path`, creates title
and description metadata, and renders through `Doc` and `Article`. Use its
`docProps`, metadata options, or `render` callback when a project needs custom
page chrome.

Register the Prestigia plugin after Content Collections. It loads and watches
`prestigia.config.ts`, then exposes configuration merged with the generated
`allDocs` collection through `virtual:prestigia/config`:

```ts
// vite.config.ts
import contentCollections from "@content-collections/vite";
import { prestigia } from "@prestigia/docs/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [contentCollections(), prestigia()],
});
```

```ts
// prestigia.config.ts
import { defineConfig } from "@prestigia/docs/vite";

export default defineConfig({
  sidebar: [
    "overview",
    {
      label: "Guides",
      collapsed: false,
      items: [{ autogenerate: { directory: "guides" } }],
    },
    { label: "Status", link: "/status" },
  ],
});
```

Sidebar entries support document slug strings, `{ slug, label? }` objects,
links, recursive groups, and directory autogeneration. Document entries use
their Content Collections titles unless a label overrides them. If `sidebar`
is omitted, navigation is generated from the full collection.

Add a `/docs` parent file route and pass the resolved virtual sidebar to
`createDocsRoute`. The sibling `docs.$slug.tsx` route is nested beneath it
while keeping the URL `/docs/$slug`:

```tsx
import { createDocsRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import config from "virtual:prestigia/config";

export const Route = createFileRoute("/docs")(
  createDocsRoute({ sidebar: config.sidebar }),
);
```

Declare the generated module once in your application (the CLI template
includes this as `src/prestigia-env.d.ts`):

```ts
declare module "virtual:prestigia/config" {
  import type { ResolvedPrestigiaConfig } from "@prestigia/docs/vite";
  const config: ResolvedPrestigiaConfig;
  export default config;
}
```

`Docs` composes the router outlet with the `Sidebar` exported by this package
and uses TanStack Router links internally.

Enable TanStack Start prerendering in the application and let its link crawler
discover every `/docs/$slug` link. Filter query/hash variants so each content
path is emitted once. Runtime SSR is an application-level opt-in, not a
Prestigia route-helper behavior.

The package also ships versioned Agent Skills under `skills/`. They preserve
the broader v0.0.3 API guidance as an explicit rebuild reference; verify
individual exports before relying on surfaces beyond the current package
README. See [`../../docs/agent-skills.md`](../../docs/agent-skills.md).
