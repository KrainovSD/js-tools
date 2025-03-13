export function extractRgb(color: string | null) {
  if (!color) return null;

  const code = color.match(/\d+/g);

  if (!code) return null;

  return {
    r: +code[0],
    g: +code[1],
    b: +code[2],
  };
}
