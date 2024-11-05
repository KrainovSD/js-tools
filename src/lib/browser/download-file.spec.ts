import { downloadFile } from "./download-file";

describe("download-file", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  Object.defineProperty(global, "IS_BROWSER", { value: true });
  const str = JSON.stringify({ text: "string" });
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/json;charset=utf-8",
  });
  const href = "download_url";

  const fileName = "file.txt";
  const fileNameHeader = `attachment; filename=${fileName}`;

  it("bad filename", () => {
    expect(() => downloadFile({ data: blob, fileName: "", mimeType: "application/json" })).toThrow(
      "Bad filename",
    );
  });
  it("correct", () => {
    const spyLinkClick = jest.fn();
    const spyLinkRemove = jest.fn();

    const linkState = {
      style: {
        display: "flex",
      },
      download: "",
      href: "",
      click: spyLinkClick,
      remove: spyLinkRemove,
    };
    const spyCreateObjectURL = jest.fn().mockReturnValue(href);
    const spyCreateElement = jest.fn().mockReturnValue(linkState);
    const spyRevokeObjectURL = jest.fn();
    const spyRemoveChild = jest.fn();
    const spyAppendChild = jest.fn();

    Object.defineProperty(global, "window", {
      value: { URL: { createObjectURL: spyCreateObjectURL, revokeObjectURL: spyRevokeObjectURL } },
    });
    Object.defineProperty(global, "document", {
      value: {
        createElement: spyCreateElement,
        body: {
          appendChild: spyAppendChild,
          removeChild: spyRemoveChild,
        },
      },
    });

    downloadFile({
      data: blob,
      fileName: fileNameHeader,
      mimeType: "application/json",
    });

    expect(spyLinkClick).toHaveBeenCalled();
    expect(spyLinkRemove).toHaveBeenCalled();
    expect(spyCreateObjectURL).toHaveBeenCalled();
    expect(spyCreateElement).toHaveBeenCalled();
    expect(spyRevokeObjectURL).toHaveBeenCalled();
    expect(spyRemoveChild).toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
    expect(linkState.href).toBe(href);
    expect(linkState.download).toBe(fileName);
    expect(linkState.style.display).toBe("none");
  });
});
