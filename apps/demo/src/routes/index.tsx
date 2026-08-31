import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prestigia Demo · See documentation in motion" },
      {
        name: "description",
        content:
          "Explore a focused Prestigia documentation project built with TanStack Start.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <section className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
        <div className="mb-8 flex size-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
          <img className="size-10" src="/logo.png" alt="" />
        </div>

        <p className="mb-5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          A minimal Prestigia workspace
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          See documentation in motion.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
          Explore a small working example with generated navigation, Markdown
          content, and a focused interface.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="h-10 bg-accent px-5 text-accent-foreground hover:bg-accent/90"
            nativeButton={false}
            render={<Link params={{ slug: "overview" }} to="/docs/$slug" />}
          >
            Explore the docs <span aria-hidden="true">→</span>
          </Button>
          <Button
            className="h-10 px-5"
            nativeButton={false}
            render={<a href="https://github.com/lukonik/prestigia" />}
            variant="outline"
          >
            View on GitHub
          </Button>
        </div>

        <p className="mt-16 text-xs tracking-wide text-muted-foreground">
          Content Collections · TanStack Start · shadcn/ui
        </p>
      </section>
    </main>
  );
}
