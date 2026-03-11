import config from "virtual:prestige/config";
import { PrestigeShellProps } from "../../routes/prestige-shell";

function License() {
  if (!config.license) {
    return null;
  }
  return (
    <a target="_blank" href={config.license.url}>
      Released under: {config.license.label}
    </a>
  );
}

function Copyright({ copyright }: Pick<PrestigeShellProps, "copyright">) {
  if (!copyright) {
    return null;
  }
  return copyright();
}

export default function Footer({
  copyright,
}: Pick<PrestigeShellProps, "copyright">) {
  return (
    <footer className="mt-10 flex items-center justify-center flex-col gap-2 px-4 border-t border-t-default-100 pt-10 bg-default-50 text-sm py-10 text-default-700">
      <License />
      <Copyright copyright={copyright} />
    </footer>
  );
}
