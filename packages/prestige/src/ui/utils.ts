export function isExternalURL(str: string) {
  try {
    const url = new URL(str);
    // This ensures it starts with http or https, filtering out
    // things like 'javascript:alert(1)' or 'mailto:test@test.com'
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
