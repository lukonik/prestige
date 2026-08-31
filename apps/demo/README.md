# Prestigia Demo

A demo of the TanStack Start application for the Prestigia documentation. It uses
file-based TanStack Router routes, validated search state, and static site
generation.

Documentation sources live in `content/docs` and are validated and generated
by Content Collections. Interface primitives live in `src/components/ui` and
use the Shadcn `base-nova` style backed by Base UI.

```bash
pnpm --filter @prestigia/demo-app dev
```

Routes import `allDocs` directly from Content Collections. TanStack Start
prerenders the index and crawls its links to generate every `/docs/$slug`
page at build time. No content server functions or runtime SSR are required.

Build the production app with:

```bash
pnpm --filter @prestigia/demo-app build
```

Deploy the generated client output to a static host. Runtime SSR can be added
later as an application-level capability when a project explicitly needs it.
