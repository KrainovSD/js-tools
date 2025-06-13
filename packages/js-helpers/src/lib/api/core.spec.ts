import { jsonParse, wait } from "../utils";
import { createRequestClientInstance } from "./core";

describe("api core", () => {
  it("success", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const outcomingData = {
      mark: 1,
      data: "test1",
    };
    const incomingData = {
      mark: 2,
      data: "test2",
    };
    const transformedOutcomingData = {
      mark: 1,
      data: "test3",
    };
    const transformedIncomingData = {
      mark: 2,
      data: "test4",
    };

    let receivedFetch: string | undefined;
    let receivedInitialIncomingData: Record<string, unknown> | undefined;
    let receivedInitialOutcomingData: Record<string, unknown> | undefined;

    Object.defineProperty(global, "fetch", {
      value: async (url: string, options: Record<string, unknown>) => {
        receivedFetch = options.body as string;
        await wait(0);

        return {
          ok: true,
          status: 200,
          json: async () => {
            await wait(0);

            return incomingData;
          },
        };
      },
    });

    const result = await request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>
    >({
      method: "POST",
      path: "http://test",
      body: outcomingData,
      transformIncomingData: (data) => {
        receivedInitialIncomingData = data;

        return { ...data, data: transformedIncomingData.data };
      },
      transformOutcomingData: (data) => {
        receivedInitialOutcomingData = data;

        return { ...data, data: transformedOutcomingData.data };
      },
      delay: 1,
    });

    expect(result.data).toEqual(transformedIncomingData);
    expect(result.status).toEqual(200);
    expect(jsonParse(receivedFetch)).toEqual(transformedOutcomingData);
    expect(receivedInitialIncomingData).toEqual(incomingData);
    expect(receivedInitialOutcomingData).toEqual(outcomingData);
  });
  it("error", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const status = 400;

    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: false,
          status,
          json: async () => {
            await wait(0);

            return null;
          },
        };
      },
    });

    await expect(
      request({
        method: "GET",
        path: "http://test",
      }),
    ).rejects.toThrow(`HTTP error! Status: ${status}`);
  });
  it("without response", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const status = 200;

    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          ok: true,
          status,
          json: async () => {
            await wait(0);

            return null;
          },
        };
      },
    });

    await expect(
      request({
        method: "GET",
        path: "http://test",
      }),
    ).resolves.toEqual({ status, data: true });
  });
  it("download error", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const status = 200;

    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          blob: async () => {
            await wait(0);

            return 1;
          },
          headers: {
            get: (path: string) => {
              switch (path) {
                case "content-type": {
                  return "";
                }
                case "content-disposition": {
                  return "";
                }
                default: {
                  return undefined;
                }
              }
            },
          },
          ok: true,
          status,
          json: async () => {
            await wait(0);

            return null;
          },
        };
      },
    });

    await expect(
      request({
        method: "GET",
        path: "http://test",
        downloadFile: true,
      }),
    ).rejects.toThrow(`Download Error! Empty info!`);
  });
  it("download success", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const status = 200;
    const data = 1;

    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return {
          blob: async () => {
            await wait(0);

            return data;
          },
          headers: {
            get: (path: string) => {
              switch (path) {
                case "content-type": {
                  return "content-type";
                }
                case "content-disposition": {
                  return "content-disposition";
                }
                default: {
                  return undefined;
                }
              }
            },
          },
          ok: true,
          status,
          json: async () => {
            await wait(0);

            return null;
          },
        };
      },
    });

    await expect(
      request({
        method: "GET",
        path: "http://test",
        downloadFile: true,
      }),
    ).resolves.toEqual({ status, data });
  });
  it("mock response", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;
    const data = 3;

    await expect(
      request({
        method: "GET",
        path: "http://test",
        mock: data,
      }),
    ).resolves.toEqual({ status: 200, data });
  });
  it("hasn't response", async () => {
    const request = createRequestClientInstance({
      client: window.fetch.bind(window),
    }).requestApiWithMeta;

    Object.defineProperty(global, "fetch", {
      value: async () => {
        await wait(0);

        return undefined;
      },
    });

    await expect(
      request({
        method: "GET",
        path: "http://test",
      }),
    ).rejects.toThrow(`hasn't response`);
  });
});
