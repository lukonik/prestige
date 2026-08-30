import { Link, createFileRoute } from "@tanstack/react-router";
import { Article } from "@prestigia/docs";

import { getDocument } from "#/features/docs/docs.functions";

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
    <main className="page-shell document-page">
      <Link className="back-link" to="/" search={{ q: "", topic: "all" }}>
        ← All documentation
      </Link>
      <div className="document-content">
        <header>
          <span className="topic">{document.topic}</span>
          <h1 id="document-title">{document.title}</h1>
          <p>{document.description}</p>
        </header>
        <Article aria-labelledby="document-title" content={document.content} />
      </div>
    </main>
  );
}
