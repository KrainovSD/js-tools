import { createURLWithQueries } from "./create-url-with-queries";

describe("create-url-with-params", () => {
  const params = {
    test: "test",
  };
  const url = "http://localhost:3000";
  const paramsResult = "test=test";
  const resultWithParams = `${url}?${paramsResult}`;

  it("success with params", () => {
    expect(createURLWithQueries({ baseURL: url, params })).toBe(resultWithParams);
  });
  it("success without params", () => {
    expect(createURLWithQueries({ baseURL: url })).toBe(url);
  });
});
