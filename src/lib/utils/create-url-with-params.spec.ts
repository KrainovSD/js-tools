import { createURLWithParams } from "./create-url-with-params";

describe("create-url-with-params", () => {
  const params = {
    test: "test",
  };
  const url = "http://localhost:3000";
  const paramsResult = "test=test";
  const resultWithParams = `${url}?${paramsResult}`;

  it("success with params", () => {
    expect(createURLWithParams({ baseURL: url, params })).toBe(resultWithParams);
  });
  it("success without params", () => {
    expect(createURLWithParams({ baseURL: url })).toBe(url);
  });
});
