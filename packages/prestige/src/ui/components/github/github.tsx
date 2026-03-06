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
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
    >
      <Github size={16} />
    </a>
  );
}
