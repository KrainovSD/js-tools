import { setByPath } from "./set-by-path";

describe("set-by-path", () => {
  const resultValue = 2;

  it("success set object", () => {
    const object = {
      test: 1,
    };
    const result = {
      test: resultValue,
    };

    setByPath(object, "test", resultValue);

    expect(object).toEqual(result);
  });
  it("success set array", () => {
    const resultValue = 2;
    const array = [1];
    const result = [resultValue];

    setByPath(array, "[0]", resultValue);

    expect(array).toEqual(result);
  });
  it("success set combine", () => {
    const combine = [{ test: [{ field: 1 }] }];
    const result = [{ test: [{ field: resultValue }] }];

    setByPath(combine, "[0].test.[0].field", resultValue);
    expect(combine).toEqual(result);
  });
  it("check is not error", () => {
    expect(void setByPath(2 as unknown as unknown[], 2 as unknown as string, 1)).toBeUndefined();
  });
});
