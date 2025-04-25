let countTime = 0;
let countOperation = 0;

export function setDrawTime(cb: () => void, showEveryTick: boolean) {
  return () => {
    const start = performance.now();
    cb();
    const end = performance.now();
    const result = end - start;

    countTime += result;
    countOperation++;

    if (showEveryTick) {
      const average = countTime / countOperation;
      // eslint-disable-next-line no-console
      console.log("average draw: ", average, "current draw: ", result);
    }
  };
}

export function getDrawTime() {
  const average = countTime / countOperation;

  // eslint-disable-next-line no-console
  console.log("average draw: ", average);
}

export function resetDrawTime() {
  countTime = 0;
  countOperation = 0;
}
