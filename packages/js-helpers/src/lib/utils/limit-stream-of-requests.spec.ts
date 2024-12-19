import { limitStreamOfRequests } from "./limit-stream-of-requests";
import { wait } from "./wait";

describe("limit-stream-of-requests", () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const countRequests = array.length;
  const maxTryCount = 3;
  const refetchAfterError = true;
  const maxCountInParallel = 5;

  it("test max promises in parallel", async () => {
    let promisesCount = 0;
    let maxPromisesCount = 0;

    const { promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      maxTryCount,
      refetchAfterError,
      collectResult: false,
      promiseGetter: () => {
        promisesCount++;
        if (maxPromisesCount < promisesCount) maxPromisesCount = promisesCount;

        return wait(0);
      },
      resultCb: () => {
        promisesCount--;
      },
    });

    await promise;

    expect(maxPromisesCount).toBe(maxCountInParallel);
  });
  it("test results of promises", async () => {
    const results: unknown[] = [];

    const { promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      maxTryCount,
      refetchAfterError,
      collectResult: true,
      promiseGetter: (count) => {
        return new Promise((resolve) => {
          resolve(array[count - 1]);
        });
      },
      resultCb: (result) => {
        results.push(result);
      },
    });

    const innerResult = await promise;

    expect(results).toEqual(array);
    expect(innerResult).toEqual(array);
  });
  it("test results of promises with refetch by error", async () => {
    const errorIndex = 3;
    const results: unknown[] = [];
    let isHasBeenError = false;
    const expectedResult = array.toSpliced(errorIndex, 1);
    expectedResult.push(array[errorIndex]);

    const { promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      maxTryCount,
      refetchAfterError,
      collectResult: true,
      promiseGetter: (count) => {
        if (count === errorIndex + 1 && !isHasBeenError) {
          isHasBeenError = true;

          return new Promise((resolve, reject) => {
            reject();
          });
        }

        return new Promise((resolve) => {
          resolve(array[count - 1]);
        });
      },
      resultCb: (result) => {
        results.push(result);
      },
    });

    const innerResult = await promise;

    expect(results).toEqual(expectedResult);
    expect(innerResult).toEqual(expectedResult);
  });
  it("test results of promises without refetch by error", async () => {
    const errorIndex = 3;
    const results: unknown[] = [];
    const expectedResult = array.toSpliced(errorIndex, 1);
    let isHasBeenError = false;

    const { promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      maxTryCount,
      refetchAfterError: false,
      collectResult: true,
      promiseGetter: (count) => {
        if (count === errorIndex + 1 && !isHasBeenError) {
          isHasBeenError = true;

          return new Promise((resolve, reject) => {
            reject();
          });
        }

        return new Promise((resolve) => {
          resolve(array[count - 1]);
        });
      },
      resultCb: (result) => {
        results.push(result);
      },
    });

    const innerResult = await promise;

    expect(results).toEqual(expectedResult);
    expect(innerResult).toEqual(expectedResult);
  });
  it("test results of promises with to many refetch by error", async () => {
    const errorIndex = 3;
    const results: unknown[] = [];
    const expectedResult = array.toSpliced(errorIndex, 1);

    const { promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      maxTryCount,
      refetchAfterError,
      collectResult: true,
      promiseGetter: (count) => {
        if (count === errorIndex + 1) {
          return new Promise((resolve, reject) => {
            reject();
          });
        }

        return new Promise((resolve) => {
          resolve(array[count - 1]);
        });
      },
      resultCb: (result) => {
        results.push(result);
      },
    });

    const innerResult = await promise;

    expect(results).toEqual(expectedResult);
    expect(innerResult).toEqual(expectedResult);
  });
  it("test stop", async () => {
    const maxRequests = 4;
    let responsesCount = 0;

    const { cancel, promise } = limitStreamOfRequests({
      countRequests,
      maxCountInParallel,
      refetchAfterError,
      collectResult: false,
      promiseGetter: () => {
        return wait(0);
      },
      resultCb: () => {
        responsesCount++;
        if (responsesCount === maxRequests) cancel();
      },
    });

    await promise;

    expect(responsesCount).toBe(maxRequests);
  });
});
