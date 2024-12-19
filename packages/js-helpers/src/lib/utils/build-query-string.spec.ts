import type { ParamsType } from "../../types";
import { buildQueryString } from "./build-query-string";

describe("build-query-string", () => {
  it("success", () => {
    const params = {
      build: ["success", "warn"],
      test: "test",
      check: null,
      not: undefined,
      object: {
        test: "test",
      },
    };
    const result = "build=success&build=warn&test=test";

    expect(buildQueryString(params as unknown as ParamsType)).toBe(result);
  });
});
