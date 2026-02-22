import { defineConfig } from "@lonik/prestige/vite";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({ component: App });

console.log(
  defineConfig({
    title: "I AM TITLE",
  }),
);

function App() {
  return <div>Hello olaa</div>;
}
