/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<TArgs extends any[]>(
  { delay }: { delay: number },
  func: (...args: TArgs) => any,
) {
  let timer: NodeJS.Timeout | undefined;
  let active = true;

  const debounced = (...args: TArgs) => {
    if (active) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (active) {
          func(...args);
        }
        timer = undefined;
      }, delay);
    } else {
      func(...args);
    }
  };
  debounced.isPending = () => {
    return timer !== undefined;
  };
  debounced.cancel = () => {
    active = false;
  };
  debounced.flush = (...args: TArgs) => {
    func(...args);
  };

  return debounced;
}
