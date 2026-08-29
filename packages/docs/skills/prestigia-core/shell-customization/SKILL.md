---
name: shell-customization
description: >
  Preserve the Prestigia v0.0.3 shell contract during the rebuild. Load for HeadContent, Scripts, Outlet, customHeaderTitle, beforeHeaderLinks, afterHeaderLinks, copyright, GitHub links, Algolia search, licensing, theme behavior, or shared documentation layout.
metadata:
  type: sub-skill
  library: "@prestigia/docs"
  library_version: 0.0.3
requires:
  - prestigia-core
sources:
  - lukonik/prestigia:docs/agent-skills.md
---

# Prestigia Shell Customization

> Rebuild status: this is versioned contract guidance for reimplementation;
> the current placeholder package does not yet export `PrestigiaShell`.

Read `prestigia-core/SKILL.md` first if the Vite plugin and `prestigia.config.ts` are not already configured.

## Mount the Shell Once

Use `PrestigiaShell` in the TanStack Router root route and keep `HeadContent` and `Scripts` in the document shell:

```tsx
import type { PrestigiaShellProps } from "@prestigia/docs/ui";
import { PrestigiaShell } from "@prestigia/docs/ui";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestigia/config";

const options: PrestigiaShellProps = {
  beforeHeaderLinks: [{ to: "/changelog", label: "Changelog" }],
  copyright: () => <span>Built by Example Co.</span>,
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PrestigiaShell options={options}>
          <Outlet />
        </PrestigiaShell>
        <Scripts />
      </body>
    </html>
  ),
});
```

## Split Serializable and Runtime Options

Put serializable site values in `prestigia.config.ts`:

```ts
export default defineConfig({
  title: "Prestigia",
  github: "https://github.com/example/docs",
  algolia: {
    appId: "APP_ID",
    apiKey: "SEARCH_ONLY_API_KEY",
    indices: ["docs"],
  },
  license: {
    label: "MIT",
    url: "https://opensource.org/license/mit",
  },
  collections: [],
});
```

Pass render functions and runtime React nodes through `PrestigiaShell`'s `options` prop:

- `customHeaderTitle?: () => ReactNode`
- `copyright?: () => ReactNode`
- `beforeHeaderLinks?: Array<{ to: string; label: string | ReactNode }>`
- `afterHeaderLinks?: Array<{ to: string; label: string | ReactNode }>`

`github`, `algolia`, and `license` are not `PrestigiaShellProps`; the shell reads them from `virtual:prestigia/config`.

## Common Mistakes

### Passing site config through `options`

The runtime options type contains only render functions and header link arrays. Put GitHub, search, and license values in `prestigia.config.ts`.

### Omitting `Scripts`

TanStack Start needs `<Scripts />` in the body for client JavaScript and hydration.

### Mounting multiple shells

`PrestigiaShell` owns the theme provider, header, main region, and footer. Mount it once at the app root.

### Replacing the root document with a page component

Keep the `<html>`, `<head>`, and `<body>` structure along with `HeadContent`; render page routes through `<Outlet />` inside the shell.
