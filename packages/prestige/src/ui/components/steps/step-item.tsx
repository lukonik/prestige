import { PropsWithChildren } from "react";

export type StepItemProps = PropsWithChildren<{
  index: number | string;
  label: string;
}>;

export function StepItem({ children, label, index }: StepItemProps) {
  return (
    <li className="group">
      <div className="flex items-baseline gap-2">
        <div className="rounded-full flex justify-center items-center text-base font-medium w-8 h-8 bg-primary-50 text-primary-400 border-2 border-primary-400">
          {index}
        </div>
        <h3 className="text-default-600">{label}</h3>
      </div>
      <div className="pb-6 group-last:pb-0 border-l-2 border-l-default-200 pl-6 ml-4 mt-1 mb-4">
        <p className="text-default-600 ">{children}</p>
      </div>
    </li>
  );
}
