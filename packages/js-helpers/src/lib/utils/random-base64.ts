export function randomBase64(byteLength = 8) {
  const randomBytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(randomBytes);

  let binaryString = "";
  for (let i = 0; i < byteLength; i++) {
    binaryString += String.fromCharCode(randomBytes[i]);
  }

  return btoa(binaryString).replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]+$/, "");
}
