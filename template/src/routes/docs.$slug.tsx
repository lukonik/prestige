import { Link, createFileRoute } from "@tanstack/react-router";

import { getDocument } from "@/features/docs/docs.functions";

export const Route = createFileRoute("/docs/$slug")({
  ssr: true,
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

  return (
    <main className="page-shell document-layout">
      <aside>
        <Link className="back-link" to="/">
          ← All documentation
        </Link>
        <nav aria-label="On this page">
          {document.sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
        </nav>
      </aside>

      <article className="document-content">
        <header>
          <p className="eyebrow">Documentation</p>
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
