import { COLOR_FORMATS } from "../../constants";
import { getColorFormat } from "./get-color-format";

describe("get-color-format", () => {
  it("is hex", () => {
    expect(getColorFormat("#ba1111")).toBe(COLOR_FORMATS.Hex);
  });
  it("is rgba", () => {
    expect(getColorFormat("rgba(255, 0, 0, 1)")).toBe(COLOR_FORMATS.Rgba);
  });
  it("is rgb", () => {
    expect(getColorFormat("rgb(255, 0, 0)")).toBe(COLOR_FORMATS.Rgb);
  });
  it("is hsl", () => {
    expect(getColorFormat("hsl(50 80% 40%)")).toBe(COLOR_FORMATS.Hsl);
  });
  it("default", () => {
    expect(getColorFormat("")).toBeUndefined();
  });
});
