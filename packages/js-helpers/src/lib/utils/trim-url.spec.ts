import { trimUrl } from "./trim-url";

describe("trim-url", () => {
  it("success trim", () => {
    const path = "auth/login";
    expect(trimUrl(`/${path}/`)).toBe(path);
    expect(trimUrl(`${path}/`)).toBe(path);
    expect(trimUrl(`/${path}`)).toBe(path);
    expect(trimUrl(path)).toBe(path);
  });
});
