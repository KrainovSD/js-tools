import { jsonParse } from "./json-parse";

describe("json-parse", () => {
  const json = JSON.stringify({ test: 2 });

  it("parse correct json", () => {
    expect(jsonParse(json)).toEqual(JSON.parse(json));
  });
  it("parse bad json", () => {
    expect(jsonParse(`${json}!`)).toBeNull();
    expect(jsonParse(2)).toBeNull();
  });
});
