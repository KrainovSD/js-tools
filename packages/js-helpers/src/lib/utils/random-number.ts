export function randomNumber(
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER,
) {
  min = Math.ceil(min);
  max = Math.floor(max + 1);

  return Math.floor(Math.random() * (max - min) + min);
}
