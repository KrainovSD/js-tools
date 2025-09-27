/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttle<TArgs extends any[]>(func: (...args: TArgs) => any, interval: number) {
  let ready = true;
  let timer: NodeJS.Timeout | undefined;

  const throttled = (...args: TArgs) => {
    if (!ready) return;
    func(...args);
    ready = false;
    timer = setTimeout(() => {
      ready = true;
      timer = undefined;
    }, interval);
  };

  throttled.isThrottled = () => {
    return timer !== undefined;
  };

  return throttled;
}
