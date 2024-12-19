import { arrayToMapByKey } from "./array-to-map-by-key";

describe("array-to-map-by-key", () => {
  it("success", () => {
    const array = [
      { id: "1", value: "test1" },
      { id: "2", value: "test2" },
    ];
    const result = {
      [array[0].id]: array[0],
      [array[1].id]: array[1],
    };

    expect(arrayToMapByKey(array, "id")).toEqual(result);
  });
});
