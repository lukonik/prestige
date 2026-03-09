import config from "virtual:prestige/config";

function License() {
  if (!config.license) {
    return null;
  }
  return <a target="_blank" href={config.license.url}>Released under: {config.license.label}</a>;
}

export default function Footer() {
  return (
    <footer className="mt-10 flex items-center justify-center border-t border-t-default-100 pt-10 bg-default-50 text-sm py-10 text-default-700">
      <License />
    </footer>
  );
}
