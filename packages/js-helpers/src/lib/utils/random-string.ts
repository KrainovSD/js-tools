const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function randomString(length: number = 16, allowCharacters: string = characters) {
  let result = "";
  let counter = 0;

  while (counter < length) {
    result += allowCharacters.charAt(Math.floor(Math.random() * allowCharacters.length));
    counter += 1;
  }

  return result;
}
