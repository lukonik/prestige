import "@tanstack/react-start/server-only";

import type { Doc, DocSummary, DocTopic } from "./docs.schema";

const documents: Array<Doc> = [
  {
    slug: "overview",
    title: "Prestigia overview",
    description:
      "Understand the repository layout, package boundaries, and shared conventions.",
    topic: "package",
    sections: [
      {
        id: "workspace",
        title: "Workspace",
        paragraphs: [
          "Prestigia is a pnpm and Nx workspace. Publishable libraries live in packages, while deployable products live in apps.",
          "Shared dependency versions are declared in the root pnpm catalog so every project resolves the same toolchain.",
        ],
      },
      {
        id: "quality",
        title: "Quality gates",
        paragraphs: [
          "Formatting, ESLint, TypeScript, package tests, and production builds are orchestrated from the workspace root.",
          "Run the narrow project checks while iterating, then run the root CI command before merging.",
        ],
      },
    ],
  },
  {
    slug: "agent-skills",
    title: "Versioned Agent Skills",
    description:
      "Author, validate, and publish reusable instructions with the documentation package.",
    topic: "skill",
    sections: [
      {
        id: "source",
        title: "Skill sources",
        paragraphs: [
          "Skill source files live under packages/docs/skills. Each skill owns a SKILL.md entry point and may include focused supporting resources.",
          "Source checks keep generated skill artifacts synchronized with their versioned inputs.",
        ],
      },
      {
        id: "validation",
        title: "Validation",
        paragraphs: [
          "Use the workspace skill validation commands to check structure and stale artifacts before publishing.",
          "Keep instructions scoped, operational, and explicit about any required tools or environment boundaries.",
        ],
      },
    ],
  },
  {
    slug: "release-workflow",
    title: "Release workflow",
    description:
      "Prepare package changes, changesets, builds, and publication from one workflow.",
    topic: "workflow",
    sections: [
      {
        id: "changesets",
        title: "Changesets",
        paragraphs: [
          "Add a changeset for every user-visible package change and describe the released behavior in product language.",
          "Versioning updates package versions and changelogs before the publish command builds every package.",
        ],
      },
      {
        id: "verification",
        title: "Verification",
        paragraphs: [
          "The CI workflow checks formatting, types, lint rules, library tests, package metadata, and production output.",
          "A successful production build is required because it also verifies server and client environment boundaries for this app.",
        ],
      },
    ],
  },
];

export function listDocuments(input: {
  query: string;
  topic: DocTopic;
}): Array<DocSummary> {
  const query = input.query.toLocaleLowerCase();

  return documents
    .filter(
      (document) => input.topic === "all" || document.topic === input.topic,
    )
    .filter((document) => {
      if (!query) return true;

      return [document.title, document.description, document.topic].some(
        (value) => value.toLocaleLowerCase().includes(query),
      );
    })
    .map(({ sections: _sections, ...summary }) => summary);
}

export function findDocument(slug: string): Doc | undefined {
  return documents.find((document) => document.slug === slug);
}

export function getDocumentationSnapshot() {
  const sections = documents.reduce(
    (total, document) => total + document.sections.length,
    0,
  );

  return {
    documents: documents.length,
    sections,
    generatedAt: new Date().toISOString(),
  };
}
