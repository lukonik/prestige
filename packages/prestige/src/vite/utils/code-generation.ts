export function genExportDefault(specifier: string) {
  return `export default ${specifier};`;
}

/** exports default undefined */
export function genExportUndefined() {
  return genExportDefault("undefined");
}
