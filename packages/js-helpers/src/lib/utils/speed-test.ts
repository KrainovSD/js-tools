type SpeedTestOptions = {
  name: string;
  iterations?: number;
  type?: "time" | "performance";
};

export function speedTest<T>(cb: () => T, opts: SpeedTestOptions): T {
  const { name, iterations = 10000, type = "performance" } = opts;
  let result: T | undefined;

  if (type === "performance") {
    const start = performance.now();

    if (iterations <= 1) {
      result = cb();
    } else {
      for (let i = 0; i < iterations; i++) {
        result = cb();
      }
    }

    const end = performance.now();
    // eslint-disable-next-line no-console
    console.log(`${name}: `, end - start);
  } else {
    // eslint-disable-next-line no-console
    console.time(name);

    if (iterations <= 1) {
      result = cb();
    } else {
      for (let i = 0; i < iterations; i++) {
        result = cb();
      }
    }

    // eslint-disable-next-line no-console
    console.timeEnd(name);
  }

  return result as T;
}
