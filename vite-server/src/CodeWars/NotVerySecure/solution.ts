export function alphanumeric(string: string): boolean {
  if (!string.length) {
    return false;
  }
  const withoutAlphanumeric = string.replace(/[a-z0-9]+/i, "");
  console.log(withoutAlphanumeric);

  const isAlphanumeric = !withoutAlphanumeric.length;
  return isAlphanumeric;
}
