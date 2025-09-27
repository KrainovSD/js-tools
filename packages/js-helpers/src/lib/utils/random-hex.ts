export function randomHex(byteLength = 8) {
  const randomBytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(randomBytes);

  let result = "";
  for (let i = 0; i < byteLength; i++) {
    result += randomBytes[i].toString(16).padStart(2, "0");
  }

  return result;
}
