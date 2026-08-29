#!/usr/bin/env node

import { pathToFileURL } from "node:url";

export const packageName = "@prestigia/cli";

export function main(): string {
  return "The Prestigia CLI is ready for its new implementation.";
}

const entry = process.argv[1];

if (entry && import.meta.url === pathToFileURL(entry).href) {
  console.log(main());
}
