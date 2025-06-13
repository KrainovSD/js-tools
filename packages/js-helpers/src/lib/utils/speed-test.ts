type SpeedTestOptions = {
  name: string;
  iterations?: number;
  type?: "time" | "performance";
};

export function speedTest<T>(cb: () => T, opts: SpeedTestOptions): T {
  const { name, iterations = 10000, type = "time" } = opts;

  if (type === "performance") {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      cb();
    }

    const end = performance.now();
    // eslint-disable-next-line no-console
    console.log(`${name}: `, end - start);
  } else {
    // eslint-disable-next-line no-console
    console.time(name);

    for (let i = 0; i < iterations; i++) {
      cb();
    }

    // eslint-disable-next-line no-console
    console.timeEnd(name);
  }

  const result = cb();

  return result;
}
