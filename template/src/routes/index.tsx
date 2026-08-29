import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getDocuments } from "@/features/docs/docs.functions";

export const Route = createFileRoute("/")({
  ssr: true,
  loader: () => getDocuments(),
  component: DocumentationIndex,
});

function DocumentationIndex() {
  const documents = Route.useLoaderData();

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Prestigia starter</p>
        <h1>Documentation that starts with content.</h1>
        <p>
          Edit Markdown, compose the interface from Shadcn components, and ship
          it with TanStack Start.
        </p>
        <Button
          className="mt-4"
          render={<a href="https://www.content-collections.dev/docs" />}
        >
          Content Collections docs
        </Button>
      </section>

      <section aria-labelledby="documents-heading" className="documents">
        <h2 id="documents-heading">Documents</h2>
        <div className="document-grid">
          {documents.map((document) => (
            <article className="document-card" key={document.slug}>
              <h3>{document.title}</h3>
              <p>{document.description}</p>
              <Link params={{ slug: document.slug }} to="/docs/$slug">
                Read document <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
