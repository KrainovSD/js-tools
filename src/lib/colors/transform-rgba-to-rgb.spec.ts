import { transformRGBAtoRGB } from "./transform-rgba-to-rgb";

describe("transform-rgb-to-rgba", () => {
  it("transform", () => {
    expect(transformRGBAtoRGB("rgba(214,71,71,0.2)")).toBe("rgb(214,71,71)");
  });
});
