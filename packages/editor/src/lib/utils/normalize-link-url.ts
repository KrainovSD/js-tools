// heuristic
export function normalizeUrl(link: string) {
  if (link.startsWith("www.")) return `https://${link}`;
  const colon = link.indexOf(":");
  const at = link.indexOf("@");
  const slash = link.indexOf("/");
  if (colon > 0 && (at === -1 || at > colon) && (slash === -1 || slash > colon)) return link;
  if (at > 0 && !link.includes("@", at + 1) && link.indexOf(".", at) > at && !link.includes(" ")) {
    return `mailto:${link}`;
  }
  return link;
}
