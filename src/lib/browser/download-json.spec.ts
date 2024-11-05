import { downloadJson } from "./download-json";

describe("download-json", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("correct", () => {
    const fileName = "file.txt";
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
    const spyCreateElement = jest.fn().mockReturnValue(linkState);
    const spyRemoveChild = jest.fn();
    const spyAppendChild = jest.fn();

    Object.defineProperty(global, "document", {
      value: {
        createElement: spyCreateElement,
        body: {
          appendChild: spyAppendChild,
          removeChild: spyRemoveChild,
        },
      },
    });

    downloadJson({ text: "string" }, fileName);

    expect(spyLinkClick).toHaveBeenCalled();
    expect(spyLinkRemove).toHaveBeenCalled();
    expect(spyCreateElement).toHaveBeenCalled();
    expect(spyRemoveChild).toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
    expect(linkState.href !== "").toBeTruthy();
    expect(linkState.download).toBe(fileName);
    expect(linkState.style.display).toBe("none");
  });
});
