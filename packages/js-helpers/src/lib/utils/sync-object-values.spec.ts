import { syncObjectValues } from "./sync-object-values";

describe("sync-object-values", () => {
  const main = {
    field1: 1,
    field2: 2,
    field3: 3,
    field4: 4,
    field5: 5,
    field6: 16,
  };
  const off = {
    field1: 11,
    field2: undefined,
    field3: 13,
    field4: 14,
    field5: 15,
    field6: 16,
  };

  it("success sync with exceptions", () => {
    const result = {
      field1: 11,
      field2: 2,
      field3: 13,
      field4: 4,
      field5: 15,
      field6: 16,
    };
    syncObjectValues(main, off, ["field4"]);

    expect(main).toEqual(result);
  });
  it("success sync without exceptions", () => {
    const result = {
      field1: 11,
      field2: 2,
      field3: 13,
      field4: 14,
      field5: 15,
      field6: 16,
    };
    syncObjectValues(main, off);

    expect(main).toEqual(result);
  });
});
