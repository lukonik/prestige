import { PrestigePage } from "@lonik/prestige/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(prestige)/docs/custom-page")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PrestigePage>
      <h1>Project Title</h1>
      <p>
        This is a <strong>semantic HTML</strong> version of a Markdown file.
        It’s designed to be readable and structured for documentation.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>
          <strong>Responsive:</strong> Scales nicely on mobile and desktop.
        </li>
        <li>
          <strong>Semantic:</strong> Uses <code>&lt;article&gt;</code> and{" "}
          <code>&lt;section&gt;</code> tags.
        </li>
        <li>
          <strong>Minimal:</strong> No heavy frameworks required.
        </li>
      </ul>

      <blockquote>
        "The best code is the code that looks like a well-written book." —{" "}
        <em>An Anonymous Developer</em>
      </blockquote>

      <h2>Code Example</h2>
      <p>Below is a snippet showing how you might render a simple function:</p>

      <h2>Conclusion</h2>
      <p>Feel free to copy this structure for your own static content pages.</p>
    </PrestigePage>
  );
}
