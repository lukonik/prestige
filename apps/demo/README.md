# Prestigia Demo

A demo of the TanStack Start application for the Prestigia documentation. It uses
file-based TanStack Router routes, validated search state, loaders, and typed
server functions.

```bash
pnpm --filter @prestigia/demo-app dev
```

The root document and public documentation routes render with `ssr: true`.
The index loader returns its critical document list immediately and an
unawaited snapshot promise that TanStack Start streams through `<Await>`.

Server functions live in `src/features/docs/*.functions.ts`. Their private
implementations live in `*.server.ts`, where Start's import protection keeps
them out of the browser build.

Build the production app with:

```bash
pnpm --filter @prestigia/demo-app build
```

No deployment adapter is installed. `src/server.ts` exposes Start's portable
Fetch handler with the default streaming renderer, so a deployment can target
its runtime without changing the route tree or application code.
