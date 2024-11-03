import { wait } from "./wait";

type LimitStreamOfRequestsOptions<T> = {
  countRequests: number;
  maxCountInParallel: number;
  promiseGetter: (count: number) => () => Promise<T>;
  refetchAfterError?: boolean;
  maxTryCount?: number;
  collectResult?: boolean;
  resultCb?: (result: T) => void;
};

export function limitStreamOfRequests<T>({
  countRequests,
  maxCountInParallel,
  promiseGetter,
  refetchAfterError,
  resultCb,
  collectResult,
  maxTryCount = 3,
}: LimitStreamOfRequestsOptions<T>): { promise: Promise<T[]>; cancel: () => void } {
  let isStopped = false;

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

      function request(cb: () => Promise<T>, position: number, tryCount: number = 1) {
        if (isStopped) return void resolve(results);
        if (currentResponses === countRequests) return void resolve(results);
        if (position > countRequests || !cb) return;

        cb()
          .then((result) => {
            if (collectResult) results.push(result);
            if (resultCb) resultCb(result);
            currentResponses++;

            request(promiseGetter(++currentRequests), currentRequests);
          })
          .catch(() => {
            if (refetchAfterError && maxTryCount > tryCount) {
              void wait(1000).then(() => request(cb, position, tryCount + 1));
            } else {
              currentResponses++;
              request(promiseGetter(++currentRequests), currentRequests);
            }
          });
      }
    }),
  };
}
