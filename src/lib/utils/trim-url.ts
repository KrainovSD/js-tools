export function trimUrl(url: string) {
  return url.replace(/^\//, "").replace(/\/$/, "");
}
