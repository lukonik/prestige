import {
  LicenseOptions,
  PrestigeShellProps,
} from "../../routes/prestige-shell";

function License({ license }: { license: LicenseOptions | undefined }) {
  if (!license) {
    return null;
  }
  return (
    <a target="_blank" href={license.url}>
      Released under: {license.label}
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
  license,
}: Pick<PrestigeShellProps, "copyright" | "license">) {
  return (
    <footer className="flex items-center justify-center flex-col gap-2 px-4 border-t border-t-default-100 pt-10 bg-default-50 text-sm py-10 text-default-700">
      <License license={license} />
      <Copyright copyright={copyright} />
    </footer>
  );
}
