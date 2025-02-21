import type { BodyInit as NodeBodyInit, Response as NodeResponse } from "node-fetch";
import { IS_BROWSER, IS_JEST, IS_NODE } from "../../constants";
import type {
  ActiveMiddleware,
  Middleware,
  MiddlewaresOptions,
  RequestInterface,
} from "../../types";
import { downloadFile } from "../browser";
import { isArray, isObject } from "../typings";
import { createURLWithParams, wait } from "../utils";
import { generateMiddlewares } from "./middlewares";

type ResponseErrorOptions = {
  message: string;
  status: number;
  description?: string;
};

export class ResponseError extends Error {
  status: number;

  description?: string;

  constructor({ message, status, description }: ResponseErrorOptions) {
    super(message);
    this.status = status;
    this.description = description;
  }
}

type CreateRequestClientInstance = {
  activeMiddlewares?: ActiveMiddleware;
  middlewareOptions?: MiddlewaresOptions;
  customMiddlewares?: Middleware[];
};

export function createRequestClientInstance({
  activeMiddlewares,
  middlewareOptions,
  customMiddlewares,
}: CreateRequestClientInstance = {}) {
  const executeMiddlewares = generateMiddlewares(
    activeMiddlewares || [],
    middlewareOptions || {},
    customMiddlewares || [],
  );

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

    if (!response) {
      throw new Error("hasn't response");
    }

    if (!response.ok) {
      throw new ResponseError({
        status: response.status,
        message: `HTTP error! Status: ${response.status}`,
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
  };
}
