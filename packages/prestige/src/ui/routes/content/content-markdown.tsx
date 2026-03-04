import { run } from "@mdx-js/mdx";
import { FunctionComponent, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";

export interface ContentMarkdownProp {
  code: string;
}

export default function ContentMarkdown({ code }: ContentMarkdownProp) {
  const [Content, setContent] = useState<FunctionComponent>();
  useEffect(() => {
    run(code, {
      ...runtime,
    }).then((rendered) => {
      setContent(rendered.default);
    });
  }, [code]);

  return <>{Content}</>;
}
