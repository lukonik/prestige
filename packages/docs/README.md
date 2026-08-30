# @prestigia/docs

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

For a complete TanStack Router document page, return `title`, `description`,
and Markdown `content` from a server function and use `createDocRoute` in the
slug route:

```tsx
import { createDocRoute } from "@prestigia/docs";
import { createFileRoute } from "@tanstack/react-router";

import { getDocument } from "@/features/docs/docs.functions";

export const Route = createFileRoute("/docs/$slug")(
  createDocRoute({ getDocument }),
);
```

The helper owns SSR loading, title and description metadata, and rendering
through the `Doc` and `Article` components. Use its `docProps`, metadata
options, or `render` callback when a project needs custom page chrome.

The package also ships versioned Agent Skills under `skills/`. They preserve
the previous v0.0.3 API guidance as an explicit rebuild reference; they do not
mean the placeholder package currently implements the documented Vite or UI
surfaces. See [`../../docs/agent-skills.md`](../../docs/agent-skills.md).
