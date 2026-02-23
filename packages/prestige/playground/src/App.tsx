import { useEffect, useState } from "react";

const date = new Date();

export function App() {
  const [html, setHtml] = useState("");
  useEffect(() => {
    fetch("demo.md")
      .then((res) => res.json())
      .then((res) => {
        setHtml(res.html);
        console.log(res.metadata);
      });
  }, []);
  return (
    <>
      PLAYqeqeqewqeqeqGROUND {date.getTime()}
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </>
  );
}
