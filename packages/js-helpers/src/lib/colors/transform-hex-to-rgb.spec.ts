import { transformHEXtoRGB } from "./transform-hex-to-rgb";

describe("transform-hex-to-rgb", () => {
  it("transform", () => {
    expect(transformHEXtoRGB("#d64747")).toBe("rgb(214,71,71)");
  });
});
