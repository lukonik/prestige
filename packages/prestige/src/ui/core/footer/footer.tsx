import { PrestigeRootRouteOptions } from "../../routes/prestige-root-route";

export type FooterProps = Pick<PrestigeRootRouteOptions, "license">;

function License({ license }: { license: FooterProps["license"] }) {
  if (!license) {
    return null;
  }
  return <a href={license.url}>Released under: {license.label}</a>;
}

export default function Footer({ license }: FooterProps) {
  return (
    <footer className="mt-10 flex items-center justify-center border-t border-t-default-100 pt-10 bg-default-50 text-sm py-10 text-default-700">
      <License license={license} />
    </footer>
  );
}
