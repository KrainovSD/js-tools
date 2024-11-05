import { getByPath } from "./get-by-path";

describe("get-by-path", () => {
  const result = "test";

  it("correct get from object", () => {
    const object = {
      test: {
        value: result,
      },
    };

    expect(getByPath(object, "test.value")).toBe(result);
  });
  it("correct get from array", () => {
    const array = [0, 2, 3, result];

    expect(getByPath(array, "[3]")).toBe(result);
  });
  it("correct get from combine", () => {
    const combine = [{ field: [{ test: result }] }];

    expect(getByPath(combine, "[0].field.[0].test")).toBe(result);
  });
  it("get default value when bad data type or bad path type", () => {
    expect(getByPath(1, "test", result)).toBe(result);
    expect(getByPath({ test: "3" }, undefined, result)).toBe(result);
  });
  it("get default value when no value in path", () => {
    expect(getByPath({ test: undefined }, "test", result)).toBe(result);
  });
});
