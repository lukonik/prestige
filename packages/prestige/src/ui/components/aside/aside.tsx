import React from "react";

export type AsideType = "note" | "tip" | "caution" | "danger";

export interface AsideProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  type?: AsideType;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const typeMap: Record<AsideType, string> = {
  note: "bg-blue-50/50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-200",
  tip: "bg-purple-50/50 dark:bg-purple-900/20 border-purple-500 text-purple-900 dark:text-purple-200",
  caution:
    "bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-200",
  danger:
    "bg-red-50/50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-200",
};

const defaultTitles: Record<AsideType, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};

export function Aside({
  type = "note",
  title,
  children,
  className,
  ...props
}: AsideProps) {
  const iconProps = {
    className: "w-5 h-5 flex-shrink-0",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const Icon = () => {
    switch (type) {
      case "note":
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        );
      case "tip":
        return (
          <svg {...iconProps}>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        );
      case "caution":
        return (
          <svg {...iconProps}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        );
      case "danger":
        return (
          <svg {...iconProps}>
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      aria-label={defaultTitles[type]}
      className={`relative my-6 px-4 py-3 border-l-4 rounded-lg ${typeMap[type]} ${className || ""}`}
      {...props}
    >
      <p className="flex items-center gap-2 mb-2 mt-0 font-bold text-lg">
        <span>
          <Icon />
        </span>
        {title || defaultTitles[type]}
      </p>
      <section className="[&>p]:mt-0 [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </section>
    </aside>
  );
}
