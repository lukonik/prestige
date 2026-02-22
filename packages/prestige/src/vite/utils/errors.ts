import { type ZodType, input } from "zod";

export class PrestigeError extends Error {}

/**
 * Parse data with zod schema and if fails throw PrestigeError that is friendly error
 * for prestige ecosystem
 */
export function parseWithFriendlyErrors<T extends ZodType>(s: T, input: input<T>, message: string) {
  try {
    return s.parse(input);
  } catch (e) {
    if (e instanceof Error) {
      throw new PrestigeError(`Prestige error cause: ${message}, with error: ${e.message} `);
    } else {
      throw new PrestigeError(`Prestige error cause: ${message} `);
    }
  }
}
