import { ReactNode } from "react";

export interface CodeProps {
  children: ReactNode;
}

export function Code({ children }: CodeProps) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}
