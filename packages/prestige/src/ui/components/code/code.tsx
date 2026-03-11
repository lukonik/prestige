import { Highlight } from "prism-react-renderer";

export interface CodeProps {
  code: string;
  language?: string;
}

export function Code({ code, language = "html" }: CodeProps) {
  // Use a fragment or div, but ensure `render` actually exists before injecting
  return (
    <Highlight code={code} language="tsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span>{i + 1}</span>
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
