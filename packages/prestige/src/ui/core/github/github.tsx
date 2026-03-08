import { Github } from "lucide-react";
import config from "virtual:prestige/config";

export function GitHub() {
  if (!config.github) {
    return null;
  }

  return (
    <a
      href={config.github}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub repository"
      title="GitHub repository"
      className="inline-flex h-8 w-8 items-center justify-center rounded border border-default-200 bg-default-50 text-default-500 hover:bg-default-100"
    >
      <Github size={16} />
    </a>
  );
}
