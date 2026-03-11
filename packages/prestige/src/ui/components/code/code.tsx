import { Highlight } from "prism-react-renderer";

export interface CodeProps {
  code: string;
  language?: string;
}

export function Code({ code, language = "tsx" }: CodeProps) {
  // Use a fragment or div, but ensure `render` actually exists before injecting
  return (
    <Highlight code={code} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre className="not-prose" style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
