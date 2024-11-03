export function transformHEXtoRGB(hex: string) {
  return `rgb(${hex.match(/\w\w/g)?.map((x) => +`0x${x}`)})`;
}
