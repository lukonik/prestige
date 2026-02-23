import { useEffect, useState } from "react";
import sidebar from "virtual:sidebar";
const date = new Date();

export function App() {
  const [html, setHtml] = useState("");
  console.log(JSON.stringify(sidebar));
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
      PLAYqeqeqewqeqeqGROUND {date.getTime()}
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </>
  );
}
