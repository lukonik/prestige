import { ReactNode } from "react";

export interface CodeProps {
  code: string;
  language?: string;
  theme?: string;
  children?: ReactNode;
}

export function Code({ code, children }: CodeProps) {
  return (
    <pre>
      <code>{code ?? children}</code>
    </pre>
  );
}
