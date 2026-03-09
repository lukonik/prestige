import { Aside, Code, PrestigePage, Tabs, TabsContent, TabsList, TabsTrigger } from "@lonik/prestige/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(prestige)/docs/custom-page")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PrestigePage>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Tab 1</TabsContent>
        <TabsContent value="analytics">Tab 2</TabsContent>
        <TabsContent value="reports">Tab 3</TabsContent>
        <TabsContent value="settings">Tab 4</TabsContent>
      </Tabs>
      <h1>Project Title</h1>
      <p>
        This is a <strong>semantic HTML</strong> version of a Markdown file.
        It’s designed to be readable and structured for documentation.
      </p>

      <Aside>THIS IS NOTe</Aside>

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

      <Code language="tsx">
        {`function helloWorld() {
  console.log("Hello, world!");
}`}
      </Code>

      <h2>Conclusion</h2>
      <p>Feel free to copy this structure for your own static content pages.</p>
    </PrestigePage>
  );
}
