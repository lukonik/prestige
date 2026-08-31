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

Add a `/docs` parent file route when document pages should share a recursive
sidebar. The sibling `docs.$slug.tsx` route is then nested beneath it while
keeping the URL `/docs/$slug`:

```tsx
import { createDocsRoute, mapDocumentsToSidebar } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

const sidebar = mapDocumentsToSidebar(allDocs);

export const Route = createFileRoute("/docs")(createDocsRoute({ sidebar }));
```

`mapDocumentsToSidebar` reads Content Collections `_meta.path` values,
converts documents to link items, and optionally groups them with `groupBy`.
`Docs` composes the router outlet with the `Sidebar` exported by this package
and uses TanStack Router links internally.

Enable TanStack Start prerendering in the application and let its link crawler
discover every `/docs/$slug` link. Filter query/hash variants so each content
path is emitted once. Runtime SSR is an application-level opt-in, not a
Prestigia route-helper behavior.

The package also ships versioned Agent Skills under `skills/`. They preserve
the previous v0.0.3 API guidance as an explicit rebuild reference; they do not
mean the placeholder package currently implements the documented Vite or UI
surfaces. See [`../../docs/agent-skills.md`](../../docs/agent-skills.md).
