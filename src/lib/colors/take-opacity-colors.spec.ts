import { takeOpacityColors } from "./take-opacity-colors";

describe("take-opacity-color", () => {
  const hex = "#d64747";
  const rgba = "rgba(214,71,71,1)";
  const rgb = "rgb(214, 71, 71)";
  const opacities = [100, 80, 40];
  const results = ["rgba(214,71,71,1)", "rgba(214,71,71,0.8)", "rgba(214,71,71,0.4)"];

  it("success transform", () => {
    expect(takeOpacityColors(hex, opacities)).toEqual(results);
    expect(takeOpacityColors(rgb, opacities)).toEqual(results);
    expect(takeOpacityColors(rgba, opacities)).toEqual(results);
  });
  it("error transform empty", () => {
    expect(takeOpacityColors("", opacities)).toEqual([]);
  });
  it("error transform", () => {
    expect(takeOpacityColors("hsl()", opacities)).toEqual([]);
  });
});
