export function findClosestNumber(numbers: number[], input: number) {
  let closestIndex = 0;
  let closestDiff: number | undefined;

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    const diff = Math.abs(input - number);

    if (closestDiff == undefined || diff < closestDiff) {
      closestDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}
