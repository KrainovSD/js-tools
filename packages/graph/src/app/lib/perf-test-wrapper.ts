/* eslint-disable no-console */
let countOfTime = 0;
let countOfOperation = 0;

export function perfTestWrapper(name: string, cb: () => void) {
  return () => {
    const start = performance.now();
    cb();
    const end = performance.now();
    const result = end - start;

    countOfTime += result;
    countOfOperation++;

    const average = countOfTime / countOfOperation;
    console.log(name, ": average: ", average, "perf: ", result);
  };
}

let countOfTime1: number = 0;
let countOfOperation1: number = 0;
let countOfTime2: number = 0;
let countOfOperation2: number = 0;
export function perfDiffWrapper(cb: () => void, cb2: () => void) {
  return () => {
    const start1 = performance.now();
    console.time("1");
    cb();
    console.timeEnd("1");
    const end1 = performance.now();
    const result1 = end1 - start1;

    countOfTime1 += result1;
    countOfOperation1++;

    const average1 = countOfTime1 / countOfOperation1;

    const start2 = performance.now();
    console.time("2");
    cb2();
    console.timeEnd("2");
    const end2 = performance.now();
    const result2 = end2 - start2;

    countOfTime2 += result2;
    countOfOperation2++;

    const average2 = countOfTime2 / countOfOperation2;

    console.log("diff; ", "average: ", average2 - average1, "pref: ", result1, " ", result2);
  };
}
