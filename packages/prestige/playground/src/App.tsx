import { useEffect, useState } from "react";
import { Sidebar } from "@lonik/prestige/ui";
import content from "virtual:contents/demo.md";
console.log("CONTENT IS ", content);
export function App() {
  const [html, setHtml] = useState("");
  useEffect(() => {
    fetch("@articles/demo.md")
      .then((res) => res.json())
      .then((res) => {
        setHtml(res.html);
        console.log(res.metadata);
      });
  }, []);
  return (
    <>
      <Sidebar />
      PLAYqeqeqewqeqeqGROUND
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </>
  );
}
