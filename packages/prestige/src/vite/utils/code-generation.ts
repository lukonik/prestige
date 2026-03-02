import { genDynamicImport } from "knitwork";

export function genExportDefault(specifier: string) {
  return `export default ${specifier};`;
}

/** exports default undefined */
export function genExportUndefined() {
  return genExportDefault("undefined");
}

export function genDynamicImportWithDefault(specifier: string) {
  return `${genDynamicImport(specifier)}.then(m => m.default)`;
}
