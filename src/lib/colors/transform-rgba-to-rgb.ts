export function transformRGBAtoRGB(rgba: string) {
  const code = rgba.match(/\d+/g);
  code?.splice(3);

  return `rgb(${code?.join(",")})`;
}
