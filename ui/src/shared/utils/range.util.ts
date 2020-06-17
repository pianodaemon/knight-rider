export function range(from: number, to: number): Array<number> {
  if (from > to) {
    throw new Error('Invalid Range.');
  }
  return Array.from(Array(to - from + 1), (v, i) => from + i);
}
