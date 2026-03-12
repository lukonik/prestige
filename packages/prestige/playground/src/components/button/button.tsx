import { PropsWithChildren } from "react";
import { ButtonProps } from "./button.types";

export const Button = ({ label, variant="primary", children }: PropsWithChildren<ButtonProps>) => {
    let className=""
    if (variant === "primary"){
        className = "rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-1 cursor-pointer font-flex px-5 py-3"
    }else if(variant ==="secondary"){
        className="rounded-full bg-gray-50 text-gray-700 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 cursor-pointer font-flex px-5 py-3"
    }
  return (
    <button className={className}>
      {label}
      {children}
    </button>
  );
};
