export function generateId(length: number = 16) {
  if (!window.crypto || !crypto.getRandomValues) {
    return `${Date.now().toString(16).padStart(2, "0")}:${Math.random().toString(16).padStart(2, "0")}`;
  }

  const randomBytes = new Uint8Array(length / 2);
  window.crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
