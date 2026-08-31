# Prestigia documentation site

This project was created with `@prestigia/cli`. It combines TanStack Start,
Tailwind CSS, Shadcn components backed by Base UI, and Content Collections.
It imports `allDocs` directly and prerenders the documentation site at build
time; no content server functions or runtime SSR are required.

```sh
pnpm install
pnpm dev
```

Author Markdown documents in `content/docs`. Add Shadcn components with:

```sh
pnpm shadcn add card
```
