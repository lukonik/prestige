import { Link, createFileRoute } from "@tanstack/react-router";

import { getDocument } from "#/features/docs/docs.functions";
import { docSearchSchema } from "#/features/docs/docs.schema";

export const Route = createFileRoute("/docs/$slug")({
  ssr: true,
  validateSearch: docSearchSchema,
  loader: ({ params }) => getDocument({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Documentation"} · Prestigia` },
      ...(loaderData
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
  }),
  component: DocumentPage,
});

function DocumentPage() {
  const document = Route.useLoaderData();
  const { section: activeSection } = Route.useSearch();

  return (
    <main className="page-shell document-layout">
      <aside className="table-of-contents">
        <Link className="back-link" to="/" search={{ q: "", topic: "all" }}>
          ← All documentation
        </Link>
        <p>On this page</p>
        <nav aria-label="On this page">
          {document.sections.map((section) => (
            <Link
              aria-current={
                activeSection === section.id ? "location" : undefined
              }
              hash={section.id}
              key={section.id}
              params={{ slug: document.slug }}
              search={{ section: section.id }}
              to="/docs/$slug"
            >
              {section.title}
            </Link>
          ))}
        </nav>
      </aside>

      <article className="document-content">
        <header>
          <span className="topic">{document.topic}</span>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
        </header>
        {document.sections.map((section) => (
          <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
