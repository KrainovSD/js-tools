import type {
  BodyInit as NodeBodyInit,
  RequestInfo as NodeRequestInfo,
  RequestInit as NodeRequestInit,
  Response as NodeResponse,
} from "node-fetch";
import { IS_BROWSER } from "../../constants";
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
import { RESPONSE_DATA_SYMBOL } from "./constants";
import { generateMiddlewares, generatePostMiddlewares } from "./middlewares";

type ResponseErrorOptions = {
  message: string;
  status: number;
  code?: number;
  description?: unknown;
  headers?: Record<string, string>;
};

export class ResponseError extends Error {
  status: number;

  code?: number;

  description?: unknown;

  headers?: Record<string, string>;

  constructor({ message, status, description, code, headers }: ResponseErrorOptions) {
    super(message);
    this.status = status;
    this.description = description;
    this.code = code;
    this.headers = headers;
  }
}

type CreateRequestClientInstance = {
  client:
    | ((url: URL | NodeRequestInfo, init?: NodeRequestInit) => Promise<NodeResponse>)
    | typeof fetch;
  activeMiddlewares?: ActiveMiddleware;
  middlewareOptions?: MiddlewaresOptions;
  customMiddlewares?: Middleware[];
  activePostMiddlewares?: ActivePostMiddleware;
  postMiddlewaresOptions?: PostMiddlewareOptions;
  customPostMiddlewares?: PostMiddleware[];
};

export type RequestInstance = {
  <IncomingApi, Incoming = IncomingApi, Outcoming = unknown, OutcomingApi = Outcoming>(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<Incoming>;
  setOptions: (options: CreateRequestClientInstance) => void;
};

export function createRequestClientInstance(options: CreateRequestClientInstance) {
  let executeMiddlewares: <
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ) => Promise<unknown>;

  let executePostMiddlewares: (response: Response | NodeResponse | undefined) => Promise<unknown>;

  function setMiddlewares({
    activeMiddlewares = [],
    middlewareOptions = {},
    customMiddlewares = [],
    activePostMiddlewares = [],
    postMiddlewaresOptions = {},
    customPostMiddlewares = [],
  }: Omit<CreateRequestClientInstance, "client"> = {}) {
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

  async function handleRequest<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
    responseWithStatus?: boolean,
  ): Promise<{ data: Incoming; status: number; headers: Record<string, string> } | Incoming> {
    if (request.delay) {
      await wait(request.delay);
    }
    if (request.mock) {
      const mock: unknown =
        typeof request.mock === "function" ? (request.mock as () => Incoming)() : request.mock;

      const transformedResult = request.transformIncomingData
        ? request.transformIncomingData(mock as IncomingApi)
        : (mock as Incoming);

      return responseWithStatus
        ? { data: transformedResult, status: 200, headers: {} }
        : transformedResult;
    }

    await executeMiddlewares(request);

    const { method, body, path, params, headers } = request;

    const url = createURLWithParams({ baseURL: path, params });
    let preparedBody: OutcomingApi | undefined = body as OutcomingApi;

    if (body && !(preparedBody instanceof FormData)) {
      if (request.transformOutcomingData) {
        preparedBody = request.transformOutcomingData(body);
      }

      if (isObject(body) || isArray(body))
        preparedBody = JSON.stringify(preparedBody) as OutcomingApi;
    }

    const response: Response | NodeResponse | undefined = await options.client(url, {
      method,
      body: preparedBody as ((BodyInit | null) & NodeBodyInit) | undefined,
      headers: {
        ...(body instanceof FormData || !body
          ? {}
          : { "Content-Type": "application/json; charset=UTF-8" }),
        ...headers,
      },
      signal: request.signal as (AbortSignal & NodeRequestInit["signal"]) | null | undefined,
    });

    await executePostMiddlewares(response);

    if (!response) {
      throw new Error("hasn't response");
    }

    if (!response.ok) {
      if (response.status === 304) {
        return responseWithStatus
          ? {
              data: undefined as Incoming,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
            }
          : (undefined as Incoming);
      }

      if (request.defaultResponse) {
        const defaultResponse: unknown =
          typeof request.defaultResponse === "function"
            ? (request.defaultResponse as () => Incoming)()
            : request.defaultResponse;

        const transformedResult = request.transformIncomingData
          ? request.transformIncomingData(defaultResponse as IncomingApi)
          : (defaultResponse as Incoming);

        return responseWithStatus
          ? {
              data: transformedResult,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
            }
          : transformedResult;
      }

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
      } catch {
        if (RESPONSE_DATA_SYMBOL in response) result = response[RESPONSE_DATA_SYMBOL];
      }

      throw new ResponseError({
        status: response.status,
        message: `HTTP error! Status: ${response.status}`,
        description: result,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    if (request.downloadFile) {
      const data = await response.blob();
      const mimeType = response.headers.get("content-type");
      const fileName = response.headers.get("content-disposition");

      if (!mimeType || !fileName) throw new Error("Download Error! Empty info!");

      if (IS_BROWSER)
        downloadFile({
          data: data as Blob,
          fileName,
          mimeType,
        });

      return responseWithStatus
        ? {
            data: data as Incoming,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          }
        : (data as Incoming);
    }

    const contentType = response.headers.get("content-type");
    let result: Incoming | IncomingApi = undefined as Incoming | IncomingApi;

    try {
      if (contentType?.includes?.("text")) {
        result = (await response.text()) as Incoming | IncomingApi;
      } else if (contentType?.includes?.("json")) {
        result = (await response.json()) as Incoming | IncomingApi;
      } else {
        result = (await response.blob()) as Incoming | IncomingApi;
      }
    } catch {}

    const transformedResult = request.transformIncomingData
      ? request.transformIncomingData(result as IncomingApi)
      : (result as Incoming);

    return responseWithStatus
      ? {
          data: transformedResult,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        }
      : transformedResult;
  }

  async function requestApi<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>): Promise<Incoming> {
    return handleRequest(request, false) as Promise<Incoming>;
  }

  async function requestApiWithMeta<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<{ data: Incoming; status: number; headers: Record<string, string> }> {
    return handleRequest(request, true) as Promise<{
      data: Incoming;
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
