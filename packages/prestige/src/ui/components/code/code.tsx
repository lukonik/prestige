import clsx from "clsx";
import { Highlight } from "prism-react-renderer";

export interface CodeProps {
  code: string;
  language?: string;
}

export function Code({ code, language = "tsx" }: CodeProps) {
  // Use a fragment or div, but ensure `render` actually exists before injecting
  return (
    <Highlight code={code} language={language}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre className={clsx("not-prose", className)}>
          <code className={clsx("code-highlight", className)}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} style={undefined}>
                {line.map((token, key) => (
                  <span
                    key={key}
                    {...getTokenProps({ token })}
                    style={undefined}
                  />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
