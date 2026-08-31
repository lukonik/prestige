import { Link, createFileRoute } from "@tanstack/react-router";
import { allDocs } from "content-collections";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { docTopics, docsSearchSchema } from "#/features/docs/docs.schema";

const documents = allDocs
  .slice()
  .sort((left, right) => left.order - right.order);
const sectionCount = documents.reduce(
  (total, document) =>
    total + (document.content.match(/^##\s+/gm)?.length ?? 0),
  0,
);

export const Route = createFileRoute("/")({
  validateSearch: docsSearchSchema,
  head: () => ({
    meta: [
      { title: "Prestigia Docs" },
      {
        name: "description",
        content:
          "Search the Prestigia package, skill, and workflow documentation.",
      },
    ],
  }),
  component: DocumentationIndex,
});

function DocumentationIndex() {
  const search = Route.useSearch();
  const query = search.q.toLocaleLowerCase();
  const filteredDocuments = documents
    .filter(
      (document) => search.topic === "all" || document.topic === search.topic,
    )
    .filter((document) => {
      if (!query) return true;

      return [document.title, document.description, document.topic].some(
        (value) => value.toLocaleLowerCase().includes(query),
      );
    });

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Workspace reference</p>
        <h1>Documentation that follows the code.</h1>
        <p>
          Find the package conventions, Agent Skill guidance, and release
          workflows used across Prestigia.
        </p>
      </section>

      <form className="filters" action="/" method="get">
        <label>
          <span>Search documentation</span>
          <Input
            defaultValue={search.q}
            name="q"
            placeholder="Try “skills” or “release”"
            type="search"
          />
        </label>
        <label>
          <span>Topic</span>
          <select defaultValue={search.topic} name="topic">
            {docTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic === "all" ? "All topics" : topic}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">Apply filters</Button>
      </form>

      <section aria-labelledby="results-heading" className="results">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Index</p>
            <h2 id="results-heading">
              {filteredDocuments.length === 1
                ? "1 document"
                : `${filteredDocuments.length} documents`}
            </h2>
          </div>
          <span className="snapshot">
            {sectionCount} sections · generated at build time
          </span>
        </div>

        {filteredDocuments.length ? (
          <div className="document-grid">
            {filteredDocuments.map((document) => (
              <article className="document-card" key={document._meta.path}>
                <span className="topic">{document.topic}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <Link
                  className="text-link"
                  params={{ slug: document._meta.path }}
                  to="/docs/$slug"
                >
                  Read document <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No documents match those filters.</h3>
            <Link className="text-link" to="/" search={{ q: "", topic: "all" }}>
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
