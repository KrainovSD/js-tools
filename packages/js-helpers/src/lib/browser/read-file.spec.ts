import { wait } from "../utils";
import { readFile } from "./read-file";

const mockResult = 1;

class FileReaderMock {
  onload: (() => void) | undefined;

  onerror: (() => void) | undefined;

  result = mockResult;

  readAsText(file: unknown) {
    void wait(1000).then(() => {
      if (file && this.onload) this.onload();
      if (!file && this.onerror) this.onerror();
    });
  }
}

describe("read-file", () => {
  beforeEach(() => {
    Object.defineProperty(global, "FileReader", {
      value: FileReaderMock,
    });
  });

  it("on load", async () => {
    await expect(readFile(true as unknown as File)).resolves.toBe(mockResult);
  });
  it("on error", async () => {
    await expect(readFile(false as unknown as File)).resolves.toBeNull();
  });
});
