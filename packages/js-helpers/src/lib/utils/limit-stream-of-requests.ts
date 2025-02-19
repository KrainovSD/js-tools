import { wait } from "./wait";

type LimitStreamOfRequestsOptions<T> = {
  countRequests: number;
  maxCountInParallel: number;
  promiseGetter: (count: number) => Promise<T>;
  refetchAfterError?: boolean;
  maxTryCount?: number;
  collectResult?: boolean;
  resultCb?: (result: T) => void;
  throwError?: boolean;
  errorCb?: (error: unknown, position: number, tryCount: number) => void;
};

export function limitStreamOfRequests<T>({
  countRequests,
  maxCountInParallel,
  promiseGetter,
  refetchAfterError,
  resultCb,
  collectResult,
  maxTryCount = 3,
  throwError,
  errorCb,
}: LimitStreamOfRequestsOptions<T>): { promise: Promise<T[]>; cancel: () => void } {
  let isStopped = false;

  if (maxCountInParallel > countRequests) maxCountInParallel = countRequests;

  return {
    cancel: () => {
      isStopped = true;
    },
    promise: new Promise((resolve) => {
      let currentRequests = 0;
      let currentResponses = 0;
      const results: T[] = [];

      for (let i = 0; i < maxCountInParallel; i++) {
        request(promiseGetter(++currentRequests), currentRequests);
      }

      function request(promise: Promise<T>, position: number, tryCount: number = 1) {
        if (isStopped) return void resolve(results);
        if (currentResponses === countRequests) return void resolve(results);
        if (position > countRequests || promise == undefined) return;

        promise
          .then((result) => {
            if (isStopped) return void resolve(results);

            if (collectResult) results.push(result);
            if (resultCb) resultCb(result);
            currentResponses++;

            request(promiseGetter(++currentRequests), currentRequests);
          })
          .catch((error: unknown) => {
            if (errorCb) errorCb(error, position, tryCount);

            if (isStopped) return void resolve(results);

            if (refetchAfterError && maxTryCount > tryCount) {
              return void wait(1000).then(() =>
                request(promiseGetter(position), position, tryCount + 1),
              );
            }

            if (throwError) {
              throw error;
            }

            currentResponses++;
            request(promiseGetter(++currentRequests), currentRequests);
          });
      }
    }),
  };
}
