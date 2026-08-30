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

The package also ships versioned Agent Skills under `skills/`. They preserve
the previous v0.0.3 API guidance as an explicit rebuild reference; they do not
mean the placeholder package currently implements the documented Vite or UI
surfaces. See [`../../docs/agent-skills.md`](../../docs/agent-skills.md).
