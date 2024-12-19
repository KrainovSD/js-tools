import { transformRGBtoRGBA } from "./transform-rgb-to-rgba";

describe("transform-rgb-to-rgba", () => {
  it("transform", () => {
    expect(transformRGBtoRGBA("rgba(214,71,71)", 20)).toBe("rgba(214,71,71,0.2)");
  });
});
