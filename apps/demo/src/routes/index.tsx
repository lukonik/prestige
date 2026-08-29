import { Await, Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDocsSnapshot, getDocuments } from "#/features/docs/docs.functions";
import { docTopics, docsSearchSchema } from "#/features/docs/docs.schema";

export const Route = createFileRoute("/")({
  ssr: true,
  validateSearch: docsSearchSchema,
  loaderDeps: ({ search }) => ({ query: search.q, topic: search.topic }),
  loader: async ({ deps }) => {
    const documents = await getDocuments({ data: deps });

    return {
      documents,
      snapshot: getDocsSnapshot(),
    };
  },
  head: () => ({
    meta: [
      { title: "Prestigia Demo" },
      {
        name: "description",
        content:
          "Search the Prestigia package, skill, and workflow documentation.",
      },
    ],
  }),
  pendingComponent: IndexPending,
  component: DocumentationIndex,
});

function DocumentationIndex() {
  const search = Route.useSearch();
  const { documents, snapshot } = Route.useLoaderData();

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
              {documents.length === 1
                ? "1 document"
                : `${documents.length} documents`}
            </h2>
          </div>
          <Await
            fallback={<span className="snapshot">Refreshing index…</span>}
            promise={snapshot}
          >
            {(value) => (
              <span className="snapshot">
                {value.sections} sections · refreshed{" "}
                {new Date(value.generatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </Await>
        </div>

        {documents.length ? (
          <div className="document-grid">
            {documents.map((document) => (
              <article className="document-card" key={document.slug}>
                <span className="topic">{document.topic}</span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <Link
                  className="text-link"
                  params={{ slug: document.slug }}
                  search={{ section: "" }}
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

function IndexPending() {
  return (
    <main className="page-shell empty-state">
      <p className="eyebrow">Loading</p>
      <h1>Preparing the documentation index…</h1>
    </main>
  );
}
