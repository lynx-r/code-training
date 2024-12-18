export function plural(n: number): boolean {
  if (n < 0) {
    throw new Error("All values must be positive integers");
  }

  return n !== 1;
}
