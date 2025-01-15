let countOfTime = 0;
let countOfOperation = 0;

export function perfTestWrapper(cb: () => void) {
  const start = performance.now();
  cb();
  const end = performance.now();
  const result = end - start;

  countOfTime += result;
  countOfOperation++;

  const average = countOfTime / countOfOperation;
  // eslint-disable-next-line no-console
  console.log(average, result);
}
