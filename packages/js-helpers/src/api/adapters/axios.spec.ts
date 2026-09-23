import axios, { AxiosError, AxiosHeaders, CanceledError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ResponseError } from "../../constants";
import { createFetchClient } from "../api";
import { REQUEST_ERROR } from "../api.constants";
import { axiosToFetch } from "./axios";

type MockHandlerResult = {
  status: number;
  data?: unknown;
  headers?: Record<string, string | string[]> | AxiosHeaders;
};

type MockHandler = (
  config: InternalAxiosRequestConfig,
) => MockHandlerResult | Promise<MockHandlerResult>;

function createMockAxios(handler: MockHandler) {
  return axios.create({
    adapter: async (config) => {
      const { status, data, headers } = await handler(config);
      return {
        data,
        status,
        statusText: "",
        headers: headers ?? {},
        config,
      } as AxiosResponse;
    },
  });
}

function createCancelingHandler(config: InternalAxiosRequestConfig) {
  return new Promise<never>((_resolve, reject) => {
    const signal = config.signal as AbortSignal | undefined;
    if (!signal) {
      reject(new CanceledError("canceled"));
      return;
    }
    signal.addEventListener("abort", () => {
      reject(new CanceledError("canceled"));
    });
  });
}

describe("axiosToFetch", () => {
  it("sends method, body, headers and queries to the axios instance", async () => {
    let receivedConfig: InternalAxiosRequestConfig | undefined;
    const instance = createMockAxios((config): MockHandlerResult => {
      receivedConfig = config;
      return {
        status: 200,
        data: JSON.stringify({ mark: 1 }),
        headers: { "content-type": "application/json" },
      };
    });
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse<{ mark: number }>({
      method: "POST",
      path: "http://test/api",
      queries: { page: 1 },
      body: { mark: 2 },
      headers: { "x-test": "yes" },
    });
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ mark: 1 });
    expect(receivedConfig?.method).toBe("post");
    expect(receivedConfig?.url).toBe("http://test/api?page=1");
    expect(receivedConfig?.data).toBe(JSON.stringify({ mark: 2 }));
    expect(receivedConfig?.headers?.get?.("x-test")).toBe("yes");
  });

  it("returns a text body as is", async () => {
    const instance = createMockAxios(
      (): MockHandlerResult => ({
        status: 200,
        data: "hello",
        headers: { "content-type": "text/plain; charset=utf-8" },
      }),
    );
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse<string>({
      method: "GET",
      path: "http://test",
    });
    expect(result.error).toBeNull();
    expect(result.data).toBe("hello");
  });

  it("does not throw on non-2xx and reports an http error with the body", async () => {
    const instance = createMockAxios(
      (): MockHandlerResult => ({
        status: 404,
        data: JSON.stringify({ message: "not found" }),
        headers: { "content-type": "application/json" },
      }),
    );
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse({
      method: "GET",
      path: "http://test",
    });
    expect(result.error).toBe(REQUEST_ERROR.Http);
    expect(result.data).toBeInstanceOf(ResponseError);
    const error = result.data as ResponseError;
    expect(error.status).toBe(404);
    expect(error.description).toEqual({ message: "not found" });
  });

  it("refetches after auth on 401", async () => {
    let call = 0;
    let receivedToken: string | undefined;
    const instance = createMockAxios((config): MockHandlerResult => {
      call += 1;
      receivedToken = config.headers?.get?.("authorization") as string | undefined;
      if (call === 1) return { status: 401, data: "", headers: {} };
      return {
        status: 200,
        data: JSON.stringify({ ok: true }),
        headers: { "content-type": "application/json" },
      };
    });
    const client = createFetchClient({
      client: axiosToFetch(instance),
      refetchAfterAuth: (req) =>
        Promise.resolve({ ...req, headers: { ...req.headers, authorization: "token" } }),
    });
    const result = await client.requestWithObjectResponse<{ ok: boolean }>({
      method: "GET",
      path: "http://test",
    });
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ ok: true });
    expect(receivedToken).toBe("token");
  });

  it("maps an axios cancel to the timeout error", async () => {
    const instance = createMockAxios(createCancelingHandler);
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse({
      method: "GET",
      path: "http://test",
      timeout: 10,
    });
    expect(result.error).toBe(REQUEST_ERROR.Timeout);
  });

  it("maps an axios network error to the network error", async () => {
    const instance = createMockAxios((): MockHandlerResult => {
      throw new AxiosError("Network Error", "ERR_NETWORK");
    });
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse({
      method: "GET",
      path: "http://test",
    });
    expect(result.error).toBe(REQUEST_ERROR.Network);
  });

  it("downloads binary data as a blob", async () => {
    const instance = createMockAxios(
      (): MockHandlerResult => ({
        status: 200,
        data: new Blob(["binary"], { type: "application/octet-stream" }),
        headers: {
          "content-type": "application/octet-stream",
          "content-disposition": 'attachment; filename="report.bin"',
        },
      }),
    );
    const client = createFetchClient({ client: axiosToFetch(instance) });
    const result = await client.requestWithObjectResponse<Blob>({
      method: "GET",
      path: "http://test",
      download: true,
    });
    expect(result.error).toBeNull();
    expect(result.data).toBeInstanceOf(Blob);
  });

  it("exposes headers like a fetch response", async () => {
    const client = axiosToFetch(
      createMockAxios(() => ({
        status: 200,
        data: "",
        headers: new AxiosHeaders({ "content-type": "application/json", "x-multi": ["a", "b"] }),
      })),
    );
    const response = await client("http://test");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      "content-type": "application/json",
      "x-multi": "a, b",
    });
  });

  it("normalizes an empty body for null body statuses", async () => {
    const client = axiosToFetch(
      createMockAxios((): MockHandlerResult => ({ status: 204, data: "", headers: {} })),
    );
    const response = await client("http://test");
    expect(response.status).toBe(204);
    expect(response.ok).toBe(true);
    await expect(response.text()).resolves.toBe("");
  });

  it("normalizes an empty buffer body for null body statuses", async () => {
    const client = axiosToFetch(
      createMockAxios(
        (): MockHandlerResult => ({
          status: 304,
          data: new ArrayBuffer(0),
          headers: {},
        }),
      ),
    );
    const response = await client("http://test");
    expect(response.status).toBe(304);
    await expect(response.text()).resolves.toBe("");
  });

  it("keeps an empty body for other statuses", async () => {
    const client = axiosToFetch(
      createMockAxios((): MockHandlerResult => ({ status: 200, data: "", headers: {} })),
    );
    const response = await client("http://test");
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    await expect(response.text()).resolves.toBe("");
  });

  it("rejects with an AbortError-named error on cancel", async () => {
    const client = axiosToFetch(createMockAxios(createCancelingHandler));
    const controller = new AbortController();
    const promise = client("http://test", { signal: controller.signal });
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
  });

  it("returns a response carried by a rejected interceptor instead of throwing", async () => {
    const instance = createMockAxios(
      (): MockHandlerResult => ({
        status: 200,
        data: "ok",
        headers: {},
      }),
    );
    instance.interceptors.response.use((response) => {
      return Promise.reject(
        new AxiosError("unauthorized", "ERR_INVALID_TOKEN", response.config, undefined, {
          ...response,
          status: 401,
        }),
      );
    });
    const client = axiosToFetch(instance);
    const response = await client("http://test");
    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
  });
});
