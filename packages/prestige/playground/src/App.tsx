import { useEffect, useState } from "react";
import { Sidebar } from "@lonik/prestige/ui";
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
      PLAYqeqeqewqeqeqGROUND {date.getTime()}
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </>
  );
}
