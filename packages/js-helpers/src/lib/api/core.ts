import type { BodyInit as NodeBodyInit, Response as NodeResponse } from "node-fetch";
import { IS_BROWSER, IS_JEST, IS_NODE } from "../../constants";
import type {
  ActiveMiddleware,
  ActivePostMiddleware,
  Middleware,
  MiddlewaresOptions,
  PostMiddleware,
  PostMiddlewareOptions,
  RequestInterface,
} from "../../types";
import { downloadFile } from "../browser";
import { isArray, isObject } from "../typings";
import { createURLWithParams, wait } from "../utils";
import { generateMiddlewares, generatePostMiddlewares } from "./middlewares";

type ResponseErrorOptions = {
  message: string;
  status: number;
  code?: number;
  description?: unknown;
};

export class ResponseError extends Error {
  status: number;

  code?: number;

  description?: unknown;

  constructor({ message, status, description, code }: ResponseErrorOptions) {
    super(message);
    this.status = status;
    this.description = description;
    this.code = code;
  }
}

type CreateRequestClientInstance = {
  activeMiddlewares?: ActiveMiddleware;
  middlewareOptions?: MiddlewaresOptions;
  customMiddlewares?: Middleware[];
  activePostMiddlewares?: ActivePostMiddleware;
  postMiddlewaresOptions?: PostMiddlewareOptions;
  customPostMiddlewares?: PostMiddleware[];
};

export type RequestInstance = {
  <T, Incoming = unknown, Body = unknown, Outcoming = unknown>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
  ): Promise<T>;
  setOptions: (options: CreateRequestClientInstance) => void;
};

export function createRequestClientInstance(options: CreateRequestClientInstance = {}) {
  let executeMiddlewares: <T, Incoming, Body, Outcoming>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
  ) => Promise<unknown>;

  let executePostMiddlewares: (response: Response | NodeResponse | undefined) => Promise<unknown>;

  function setMiddlewares({
    activeMiddlewares = [],
    middlewareOptions = {},
    customMiddlewares = [],
    activePostMiddlewares = [],
    postMiddlewaresOptions = {},
    customPostMiddlewares = [],
  }: CreateRequestClientInstance = {}) {
    executeMiddlewares = generateMiddlewares(
      activeMiddlewares,
      middlewareOptions,
      customMiddlewares,
    );

    executePostMiddlewares = generatePostMiddlewares(
      activePostMiddlewares,
      postMiddlewaresOptions,
      customPostMiddlewares,
    );
  }

  setMiddlewares(options);

  async function handleRequest<T, Incoming = unknown, Body = unknown, Outcoming = unknown>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
    responseWithStatus?: boolean,
  ): Promise<{ data: T; status: number; headers: Record<string, string> } | T> {
    if (request.delay) {
      await wait(request.delay);
    }
    if (request.mock) {
      const transformedResult = request.transformIncomingData
        ? request.transformIncomingData(request.mock)
        : (request.mock as T);

      return responseWithStatus
        ? { data: transformedResult, status: 200, headers: {} }
        : transformedResult;
    }

    await executeMiddlewares(request);

    const { method, body, path, params, headers } = request;

    const url = createURLWithParams({ baseURL: path, params });
    let preparedBody = body;

    if (body && !(preparedBody instanceof FormData)) {
      if (request.transformOutcomingData) {
        preparedBody = request.transformOutcomingData(body as Body);
      }

      if (isObject(body) || isArray(body)) preparedBody = JSON.stringify(preparedBody) as Outcoming;
    }

    let response: Response | NodeResponse | undefined;

    if (IS_BROWSER || IS_JEST) {
      response = await fetch(url, {
        method,
        body: preparedBody as BodyInit,
        headers: {
          ...(body instanceof FormData || !body
            ? {}
            : { "Content-Type": "application/json; charset=UTF-8" }),
          ...headers,
        },
        signal: request.signal,
      });
    }
    if (IS_NODE && !IS_JEST) {
      const nodeFetch = (await import("node-fetch")).default;
      response = await nodeFetch(url, {
        method,
        body: preparedBody as NodeBodyInit,
        headers: {
          ...(body instanceof FormData || !body
            ? {}
            : { "Content-Type": "application/json; charset=UTF-8" }),
          ...headers,
        },
        signal: request.signal,
      });
    }

    await executePostMiddlewares(response);

    if (!response) {
      throw new Error("hasn't response");
    }

    if (!response.ok) {
      let result;
      try {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes?.("text")) {
          result = await response.text();
        } else if (contentType?.includes?.("json")) {
          result = await response.json();
        } else {
          result = await response.blob();
        }
      } catch {}

      throw new ResponseError({
        status: response.status,
        message: `HTTP error! Status: ${response.status}`,
        description: result,
      });
    }

    if (request.downloadFile) {
      const data = await response.blob();
      const mimeType = response.headers.get("content-type");
      const fileName = response.headers.get("content-disposition");

      if (!mimeType || !fileName) throw new Error("Download Error! Empty info!");

      if (IS_BROWSER)
        downloadFile({
          data,
          fileName,
          mimeType,
        });

      return responseWithStatus
        ? {
            data: data as T,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          }
        : (data as T);
    }

    if (request.withoutResponse)
      return responseWithStatus
        ? {
            data: true as T,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          }
        : (true as T);

    const contentType = response.headers.get("content-type");
    let result: Incoming;

    if (contentType?.includes?.("text")) {
      result = (await response.text()) as Incoming;
    } else if (contentType?.includes?.("json")) {
      result = (await response.json()) as Incoming;
    } else {
      result = (await response.blob()) as Incoming;
    }

    const transformedResult = request.transformIncomingData
      ? request.transformIncomingData(result)
      : (result as unknown as T);

    return responseWithStatus
      ? {
          data: transformedResult,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        }
      : transformedResult;
  }

  async function requestApi<T, Incoming = unknown, Body = unknown, Outcoming = unknown>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
  ): Promise<T> {
    return handleRequest(request, false) as Promise<T>;
  }

  async function requestApiWithMeta<T, Incoming = unknown, Body = unknown, Outcoming = unknown>(
    request: RequestInterface<T, Incoming, Body, Outcoming>,
  ): Promise<{ data: T; status: number; headers: Record<string, string> }> {
    return handleRequest(request, true) as Promise<{
      data: T;
      status: number;
      headers: Record<string, string>;
    }>;
  }

  return {
    requestApi,
    requestApiWithMeta,
    setMiddlewares,
  };
}
