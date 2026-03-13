import { PropsWithChildren } from "react";

export type StepsProps = PropsWithChildren;

export function Steps({ children }: StepsProps) {
  return <ul>{children}</ul>;
}
