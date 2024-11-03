export function transformRGBtoRGBA(rgb: string, opacity: number) {
  const code = rgb.match(/\d+/g);
  code?.push(String(opacity / 100));

  return `rgba(${code?.join(",")})`;
}
