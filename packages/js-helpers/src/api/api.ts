import type {
  HeadersInit,
  BodyInit as NodeBodyInit,
  RequestInfo as NodeRequestInfo,
  RequestInit as NodeRequestInit,
  Response as NodeResponse,
} from "node-fetch";
import { IS_BROWSER, ResponseError } from "../constants";
import { createURLWithQueries, downloadFile, isArray, isString, wait } from "../lib";
import { REQUEST_ERROR, RESPONSE_DATA_SYMBOL } from "./api.constants";
import type {
  AfterHandler,
  BeforeHandler,
  OauthOptions,
  RequestError,
  RequestInterface,
} from "./api.types";
import { refetchAfterOauth } from "./oauth";

type CreateRequestClientInstance = {
  client:
    | ((url: URL | NodeRequestInfo, init?: NodeRequestInit) => Promise<NodeResponse>)
    | typeof fetch;
  oauthOptions?: OauthOptions;
  beforeHandlers?: BeforeHandler[];
  afterHandlers?: AfterHandler[];
  retries?: number[];
  timeout?: number;
};

export type RequestInstance = {
  <IncomingApi, Incoming = IncomingApi, Outcoming = unknown, OutcomingApi = Outcoming>(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<Incoming>;
  recreate: (options: CreateRequestClientInstance) => void;
};

export function createFetchClient(options: CreateRequestClientInstance) {
  let client:
    | ((url: URL | NodeRequestInfo, init?: NodeRequestInit) => Promise<NodeResponse>)
    | typeof fetch = options.client;
  let oauthOptions: OauthOptions | undefined = options.oauthOptions;
  let beforeHandlers: BeforeHandler[] | undefined = options.beforeHandlers;
  let afterHandlers: AfterHandler[] | undefined = options.afterHandlers;
  let retries: number[] | undefined = options.retries;
  let timeout: number | undefined = options.timeout;

  function recreate(options: CreateRequestClientInstance) {
    if ("client" in options) {
      client = options.client;
    }
    if ("oauthOptions" in options) {
      oauthOptions = options.oauthOptions;
    }
    if ("beforeHandlers" in options) {
      beforeHandlers = options.beforeHandlers;
    }
    if ("afterHandlers" in options) {
      afterHandlers = options.afterHandlers;
    }
    if ("retries" in options) {
      retries = options.retries;
    }
    if ("timeout" in options) {
      timeout = options.timeout;
    }
  }

  async function handleRequest<
    IncomingApi = unknown,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<
    | {
        data: ResponseError;
        error: RequestError;
        response: Response | NodeResponse | null;
      }
    | { data: Incoming; error: null; response: Response | NodeResponse | null }
  > {
    const timeoutController = new AbortController();
    const requestController = new AbortController();
    const requestTimeout = request.timeout ?? timeout;
    const requestRetries = request.retries ?? retries;

    try {
      if (request.delay) {
        await wait(request.delay);
      }
      if (request.mock) {
        const mock: unknown =
          typeof request.mock === "function" ? (request.mock as () => Incoming)() : request.mock;

        const transformedResult = request.transformIncomingData
          ? request.transformIncomingData(mock as IncomingApi)
          : (mock as Incoming);

        return { data: transformedResult, error: null, response: null };
      }

      if (requestTimeout != undefined && requestTimeout != 0) {
        setTimeout(() => {
          if (requestController.signal.aborted) return;
          timeoutController.abort();
        }, requestTimeout);
        timeoutController.signal.addEventListener("abort", () => requestController.abort(), {
          once: true,
          signal: requestController.signal,
        });
      }
      if (request.signal) {
        request.signal.addEventListener("abort", () => requestController.abort(), {
          once: true,
          signal: requestController.signal,
        });
      }

      {
        let handlers: BeforeHandler[] = [];
        if (request.beforeHandlers) {
          handlers = request.beforeHandlers;
        } else if (beforeHandlers) {
          handlers = beforeHandlers;
        }
        if (request.additionalBeforeHandlers) {
          handlers = handlers.concat(request.additionalBeforeHandlers);
        }

        if (handlers.length > 0) {
          await executeBeforeHandlers(handlers, request);
        }
      }

      const { method, body, path, queries, headers = {}, refetchNoAuth = true } = request;

      const url = createURLWithQueries({ baseURL: path, params: queries });
      let [, requestContentType] =
        Object.entries(headers).find(([header]) => header.toLowerCase() === "content-type") ?? [];
      if (isArray(requestContentType)) {
        requestContentType = requestContentType[0];
      }

      let preparedBody: OutcomingApi = body as OutcomingApi;
      if (request.transformOutcomingData) {
        preparedBody = request.transformOutcomingData(body as Outcoming);
      }

      if (
        requestContentType == undefined &&
        !(preparedBody instanceof FormData) &&
        preparedBody != undefined &&
        !isString(preparedBody)
      ) {
        headers["content-type"] = "application/json; charset=UTF-8";
      }

      if (
        (requestContentType == undefined || requestContentType.toLowerCase().includes("json")) &&
        preparedBody != undefined &&
        !(preparedBody instanceof FormData) &&
        !isString(preparedBody)
      ) {
        preparedBody = JSON.stringify(preparedBody) as OutcomingApi;
      }
      const response: Response | NodeResponse | undefined = await client(url, {
        method,
        body: preparedBody as ((BodyInit | null) & NodeBodyInit) | undefined,
        headers: headers as globalThis.HeadersInit & HeadersInit,
        signal: requestController.signal as
          | (AbortSignal & NodeRequestInit["signal"])
          | null
          | undefined,
        cache: request.cache,
        credentials: request.credentials,
        integrity: request.integrity,
        keepalive: request.keepalive,
        mode: request.mode,
        priority: request.priority,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        compress: request.compress,
        follow: request.follow,
      });

      {
        let handlers: AfterHandler[] = [];
        if (request.afterHandlers) {
          handlers = request.afterHandlers;
        } else if (afterHandlers) {
          handlers = afterHandlers;
        }
        if (request.additionalAfterHandlers) {
          handlers = handlers.concat(request.additionalAfterHandlers);
        }

        if (handlers.length > 0) {
          await executeAfterHandlers(handlers, request, response);
        }
      }

      if (!response.ok) {
        if (response.status === 304) {
          const error = new ResponseError({
            message: REQUEST_ERROR.CACHE_ERROR,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
          });
          request.onError?.(REQUEST_ERROR.CACHE_ERROR, error);

          return { data: error, error: REQUEST_ERROR.CACHE_ERROR, response };
        }
        if (response.status === 401 && refetchNoAuth && oauthOptions) {
          return await refetchAfterOauth(oauthOptions, () =>
            handleRequest({ ...request, refetchNoAuth: false }),
          );
        }

        if (request.defaultResponse) {
          const defaultResponse: unknown =
            typeof request.defaultResponse === "function"
              ? (request.defaultResponse as () => Incoming)()
              : request.defaultResponse;

          const transformedResult = request.transformIncomingData
            ? request.transformIncomingData(defaultResponse as IncomingApi)
            : (defaultResponse as Incoming);

          return {
            data: transformedResult,
            error: null,
            response: null,
          };
        }
        if (requestRetries && requestRetries.length > 0) {
          await wait(requestRetries[0]);

          return await handleRequest({ ...request, retries: requestRetries.slice(1) });
        }

        let result;
        try {
          const contentType = response.headers.get("content-type");

          if (RESPONSE_DATA_SYMBOL in response) {
            result = response[RESPONSE_DATA_SYMBOL];
          } else if (contentType?.includes?.("text")) {
            result = await response.text();
          } else if (contentType?.includes?.("json")) {
            result = await response.json();
          } else {
            result = await response.blob();
          }
        } catch {}

        const error = new ResponseError({
          status: response.status,
          message: REQUEST_ERROR.HTTP_ERROR,
          description: result,
          headers: Object.fromEntries(response.headers.entries()),
        });
        request.onError?.(REQUEST_ERROR.HTTP_ERROR, error);

        return {
          data: error,
          error: REQUEST_ERROR.HTTP_ERROR,
          response,
        };
      }

      if (request.download) {
        const data = await response.blob();
        const mimeType = response.headers.get("content-type");
        const fileName = response.headers.get("content-disposition");

        if (!mimeType) {
          console.warn("couldn't download file because content-type header is not exist");
        } else if (!fileName) {
          console.warn("couldn't download file because content-disposition header is not exist");
        }

        if (IS_BROWSER && mimeType && fileName)
          downloadFile({
            data: data as Blob,
            fileName,
            mimeType,
          });

        return {
          data: data as Incoming,
          error: null,
          response,
        };
      }

      const contentType = response.headers.get("content-type");
      let result: Incoming | IncomingApi = undefined as Incoming | IncomingApi;

      if (RESPONSE_DATA_SYMBOL in response) {
        result = response[RESPONSE_DATA_SYMBOL] as Incoming | IncomingApi;
      } else if (contentType?.includes?.("text")) {
        result = (await response.text()) as Incoming | IncomingApi;
      } else if (contentType?.includes?.("json")) {
        result = (await response.json()) as Incoming | IncomingApi;
      } else {
        result = (await response.blob()) as Incoming | IncomingApi;
      }

      const transformedResult = request.transformIncomingData
        ? request.transformIncomingData(result as IncomingApi)
        : (result as Incoming);

      return {
        data: transformedResult,
        error: null,
        response,
      };
    } catch (err: unknown) {
      if (request.defaultResponse) {
        const defaultResponse: unknown =
          typeof request.defaultResponse === "function"
            ? (request.defaultResponse as () => Incoming)()
            : request.defaultResponse;

        const transformedResult = request.transformIncomingData
          ? request.transformIncomingData(defaultResponse as IncomingApi)
          : (defaultResponse as Incoming);

        return {
          data: transformedResult,
          error: null,
          response: null,
        };
      }
      if (requestRetries && requestRetries.length > 0 && request?.signal?.aborted !== true) {
        await wait(requestRetries[0]);

        return await handleRequest({ ...request, retries: requestRetries.slice(1) });
      }

      if (err instanceof TypeError) {
        const error = new ResponseError({
          message: REQUEST_ERROR.NETWORK_ERROR,
          status: 0,
          description: String(err.message),
        });
        request.onError?.(REQUEST_ERROR.NETWORK_ERROR, error);

        return { data: error, error: REQUEST_ERROR.NETWORK_ERROR, response: null };
      }

      if (err instanceof Error && err.name === "AbortError") {
        if (timeoutController.signal.aborted) {
          const error = new ResponseError({
            message: REQUEST_ERROR.TIMEOUT_ERROR,
            status: 0,
          });
          request.onError?.(REQUEST_ERROR.TIMEOUT_ERROR, error);

          return { data: error, error: REQUEST_ERROR.TIMEOUT_ERROR, response: null };
        }

        const error = new ResponseError({
          message: REQUEST_ERROR.ABORT_ERROR,
          status: 0,
        });
        request.onError?.(REQUEST_ERROR.ABORT_ERROR, error);

        return { data: error, error: REQUEST_ERROR.ABORT_ERROR, response: null };
      }

      const error = new ResponseError({
        message: REQUEST_ERROR.UNKNOWN_ERROR,
        status: 0,
        description: String(err),
      });
      request.onError?.(REQUEST_ERROR.UNKNOWN_ERROR, error);

      return { data: error, error: REQUEST_ERROR.UNKNOWN_ERROR, response: null };
    } finally {
      requestController.abort();
    }
  }

  async function requestWithArrayResponse<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<
    | [ResponseError, RequestError, Response | NodeResponse | null]
    | [Incoming, null, Response | NodeResponse | null]
  > {
    const response = await handleRequest(request);

    return [response.data, response.error, response.response] as
      | [ResponseError, RequestError, Response | NodeResponse | null]
      | [Incoming, null, Response | NodeResponse | null];
  }

  async function requestWithObjectResponse<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<
    | {
        data: ResponseError;
        error: RequestError;
        response: Response | NodeResponse | null;
      }
    | { data: Incoming; error: null; response: Response | NodeResponse | null }
  > {
    return handleRequest(request);
  }

  return {
    requestWithArrayResponse,
    requestWithObjectResponse,
    recreate,
  };
}

function executeBeforeHandlers<
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
>(
  handlers: BeforeHandler[],
  request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
) {
  return new Promise((resolve) => {
    void (async () => {
      for (const handler of handlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler(request);
      }

      resolve(1);
    })();
  });
}

function executeAfterHandlers<
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
>(
  handlers: AfterHandler[],
  request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  response: Response | NodeResponse | undefined,
) {
  return new Promise((resolve) => {
    void (async () => {
      for (const handler of handlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler(request, response);
      }

      resolve(1);
    })();
  });
}
