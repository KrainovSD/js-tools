import { getFileNameFromHeader } from "./get-file-name-from-header";

describe("get-file-name-from-header", () => {
  it("correct name", () => {
    const response = "Извлечение+текста.pmd";
    const firstHeader = `
attachment; filename*=UTF-8''%D0%98%D0%B7%D0%B2%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5+%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0.pmd`;
    const secondHeader = `
attachment; filename*=UTF-8''${response}
`;
    const thirdHeader = `attachment; filename=${response}`;

    expect(getFileNameFromHeader(firstHeader)).toBe(response);
    expect(getFileNameFromHeader(secondHeader)).toBe(response);
    expect(getFileNameFromHeader(thirdHeader)).toBe(response);
    expect(getFileNameFromHeader("")).toBeNull();
  });
});
