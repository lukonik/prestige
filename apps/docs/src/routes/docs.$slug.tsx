import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { allDocs } from "content-collections";

function toId(title: string): string {
  return title
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type DocSection = {
  id: string;
  title: string;
  paragraphs: Array<string>;
};

function parseSections(content: string) {
  const sections: Array<DocSection> = [];
  let currentSection: DocSection | undefined;

  for (const block of content.trim().split(/\n\s*\n/)) {
    if (block.startsWith("## ")) {
      const title = block.slice(3).trim();
      currentSection = { id: toId(title), title, paragraphs: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection) currentSection.paragraphs.push(block.trim());
  }

  return sections;
}

export const Route = createFileRoute("/docs/$slug")({
  loader: ({ params }) => {
    const document = allDocs.find(
      (candidate) => candidate._meta.path === params.slug,
    );

    if (!document) throw notFound();

    return {
      ...document,
      slug: document._meta.path,
      sections: parseSections(document.content),
    };
  },
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
      <aside className="table-of-contents">
        <Link className="back-link" to="/" search={{ q: "", topic: "all" }}>
          ← All documentation
        </Link>
        <p>On this page</p>
        <nav aria-label="On this page">
          {document.sections.map((section) => (
            <Link
              hash={section.id}
              key={section.id}
              params={{ slug: document.slug }}
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
