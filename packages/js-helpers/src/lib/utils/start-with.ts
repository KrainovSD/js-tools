export function startWith(string: string, mask: string) {
  const maskSize = mask.length;
  let pos = 0;

  while (pos < maskSize) {
    if (string.codePointAt(pos) !== mask.codePointAt(pos)) return false;
    pos++;
  }

  return true;
}
