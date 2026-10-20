type TickOptions = {
  type?: "micro" | "macro";
  delay?: number;
  deep?: number;
  maxDeep?: number;
  recursiveCondition?: () => boolean;
  delayGetter?: (deep: number) => number;
};

export function tick({
  deep = 1,
  maxDeep = 1,
  delay = 0,
  recursiveCondition,
  delayGetter,
  type = "macro",
}: TickOptions) {
  return new Promise((resolve) => {
    if (type === "micro") {
      if (deep >= maxDeep || !recursiveCondition || recursiveCondition()) resolve(1);
      else
        void tick({ deep: deep + 1, maxDeep, delay, recursiveCondition, type, delayGetter }).then(
          () => resolve(1),
        );
    }
    if (type === "macro") {
      const currentDelay = delayGetter ? delayGetter(deep) : delay;

      setTimeout(() => {
        if (deep >= maxDeep || !recursiveCondition || recursiveCondition()) resolve(1);
        else
          void tick({ deep: deep + 1, maxDeep, delay, recursiveCondition, type, delayGetter }).then(
            () => resolve(1),
          );
      }, currentDelay);
    }
  });
}
