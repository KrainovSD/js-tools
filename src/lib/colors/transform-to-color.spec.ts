import { COLOR_FORMATS } from "../../constants";
import type { ColorFormat } from "../../types";
import { transformToColor } from "./transform-to-color";

describe("transform-to-color", () => {
  it("transform to hex", () => {
    const value = "d64747";
    expect(transformToColor(value, "black", COLOR_FORMATS.Hex)).toBe(`#${value}`);
    expect(transformToColor(`#${value}`, "black", COLOR_FORMATS.Hex)).toBe(`#${value}`);
  });
  it("transform to rgb", () => {
    const value = "214, 71, 71";
    expect(transformToColor(value, "black", COLOR_FORMATS.Rgb)).toBe(`rgb(${value})`);
    expect(transformToColor(`rgb(${value})`, "black", COLOR_FORMATS.Rgb)).toBe(`rgb(${value})`);
  });
  it("transform to rgba", () => {
    const value = "214, 71, 71, 1";
    expect(transformToColor(value, "black", COLOR_FORMATS.Rgba)).toBe(`rgba(${value})`);
    expect(transformToColor(`rgba(${value})`, "black", COLOR_FORMATS.Rgba)).toBe(`rgba(${value})`);
  });
  it("transform to hsl", () => {
    const value = "0, 67, 84";
    expect(transformToColor(value, "black", COLOR_FORMATS.Hsl)).toBe(`hsl(${value})`);
    expect(transformToColor(`hsl(${value})`, "black", COLOR_FORMATS.Hsl)).toBe(`hsl(${value})`);
  });
  it("transform to hex default", () => {
    const value = "d64747";
    expect(transformToColor(value, "black", "default" as ColorFormat)).toBe(`#${value}`);
  });
});
