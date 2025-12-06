import { wait } from "./wait";

type LimitStreamOfRequestsOptions<T> = {
  countRequests: number;
  maxCountInParallel: number;
  promiseGetter: (count: number) => Promise<T>;
  refetchAfterError?: boolean;
  maxTryCount?: number;
  tryDelay?: number;
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
  tryDelay = 1000,
  throwError,
  errorCb,
}: LimitStreamOfRequestsOptions<T>): { promise: Promise<T[]>; cancel: () => void } {
  let isStopped = false;

  if (maxCountInParallel > countRequests) maxCountInParallel = countRequests;

  return {
    cancel: () => {
      isStopped = true;
    },
    promise: new Promise((resolve, reject) => {
      let requestsAmount = 0;
      let responsesAmount = 0;
      let requestInProgress = 0;
      const results: T[] = [];

      for (let i = 0; i < maxCountInParallel; i++) {
        request(++requestsAmount);
      }

      function request(position: number, tryCount: number = 1) {
        if (isStopped) return void resolve(results);
        if (responsesAmount === countRequests) return void resolve(results);
        if (position > countRequests) {
          if (requestInProgress === 0) {
            return void resolve(results);
          }

          return;
        }
        const promise = promiseGetter(position);
        requestInProgress++;
        Promise.resolve(promise)
          .then((result) => {
            requestInProgress--;
            if (collectResult) results.push(result);
            if (resultCb) resultCb(result);
            responsesAmount++;
            request(++requestsAmount);
          })
          .catch((error: unknown) => {
            requestInProgress--;
            if (errorCb) errorCb(error, position, tryCount);
            if (refetchAfterError && maxTryCount > tryCount) {
              return void wait(tryDelay).then(() => request(position, tryCount + 1));
            }
            if (throwError) {
              reject(error);
            }
            responsesAmount++;
            request(++requestsAmount);
          });
      }
    }),
  };
}
