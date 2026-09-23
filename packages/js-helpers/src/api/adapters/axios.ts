import type {
  AxiosError,
  AxiosHeaderValue,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type {
  Headers,
  RequestInfo as NodeRequestInfo,
  RequestInit as NodeRequestInit,
} from "node-fetch";
import type { CreateRequestClientInstance } from "../api.types";

export function axiosToFetch(axios: AxiosInstance): CreateRequestClientInstance["client"] {
  async function fetchLike(
    url: URL | NodeRequestInfo,
    init?: NodeRequestInit & { credentials?: RequestCredentials },
  ) {
    const config: AxiosRequestConfig = {
      url: getStringURL(url),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- avoid empty string
      method: (init?.method as AxiosRequestConfig["method"]) || "GET",
      data: init?.body,
      headers: createAxiosHeaders(init?.headers),
      signal: (init?.signal ?? undefined) as AbortSignal | undefined,
      withCredentials: init?.credentials === "include",
      responseType: "arraybuffer",
    };
    const result = await resolveAxiosResponse(axios, config);
    return new Response(createResponseBody(result), {
      status: result.status,
      statusText: result.statusText,
      headers: createFetchHeaders(result.headers),
    });
  }
  return fetchLike as CreateRequestClientInstance["client"];
}

async function resolveAxiosResponse(
  axios: AxiosInstance,
  config: AxiosRequestConfig,
): Promise<AxiosResponse> {
  try {
    return await axios.request(config);
  } catch (error) {
    const axiosError = asAxiosError(error);
    if (!axiosError) {
      throw error;
    }
    if (axiosError.response) {
      return axiosError.response;
    }
    if (isCanceledError(axiosError)) {
      const abortError = new Error(axiosError.message || "This operation was aborted");
      abortError.name = "AbortError";
      throw abortError;
    }
    throw new TypeError(axiosError.message || "Failed to fetch");
  }
}

function createResponseBody(response: AxiosResponse): BodyInit | undefined {
  const data: unknown = response.data;
  if (data == undefined) return undefined;
  if (typeof data === "string" && data.length === 0) return undefined;
  if (data instanceof ArrayBuffer && data.byteLength === 0) return undefined;
  if (data instanceof Blob && data.size === 0) return undefined;
  if (ArrayBuffer.isView(data) && data.byteLength === 0) return undefined;
  return data as BodyInit;
}

function getStringURL(url: URL | NodeRequestInfo): string {
  if (typeof url === "string") return url;
  if (url instanceof URL) return url.toString();
  if ("url" in url) return url.url;
  return url.href;
}

function isHeaders(headers: NodeRequestInit["headers"]): headers is Headers {
  return headers?.constructor?.name === "Headers";
}

function createAxiosHeaders(headers: NodeRequestInit["headers"]): Record<string, string> {
  const rawHeaders: Record<string, string> = {};
  if (isHeaders(headers)) {
    headers.forEach((value, name) => {
      rawHeaders[name] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([name, value]) => {
      if (value) {
        rawHeaders[name] = value;
      }
    });
  } else if (headers != undefined) {
    Object.entries(headers).forEach(([name, value]) => {
      const rawValue = value && Array.isArray(value) ? value[0] : value;
      if (rawValue) {
        rawHeaders[name] = rawValue;
      }
    });
  }
  return rawHeaders;
}

function asAxiosError(error: unknown): AxiosError | undefined {
  if (error && typeof error === "object" && "isAxiosError" in error && error.isAxiosError) {
    return error as AxiosError;
  }
  return undefined;
}

function isCanceledError(error: AxiosError): boolean {
  return (
    error.code === "ERR_CANCELED" ||
    error.name === "CanceledError" ||
    error.name === "AbortError" ||
    error.message === "canceled"
  );
}

function createFetchHeaders(axiosHeaders: AxiosResponse["headers"] = {}): [string, string][] {
  const record = axiosHeadersToRecord(axiosHeaders);
  const headers: [string, string][] = [];
  for (const [name, value] of Object.entries(record)) {
    const normalized = axiosHeaderValueToString(value);
    if (normalized === undefined) continue;
    headers.push([name, normalized]);
  }
  return headers;
}

function axiosHeadersToRecord(
  axiosHeaders: AxiosResponse["headers"],
): Record<string, AxiosHeaderValue> {
  if ("toJSON" in axiosHeaders && typeof axiosHeaders.toJSON === "function") {
    return axiosHeaders.toJSON();
  }
  return axiosHeaders as Record<string, AxiosHeaderValue>;
}

function axiosHeaderValueToString(value: AxiosHeaderValue): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string");
    return items.length > 0 ? items.join(", ") : undefined;
  }
  return undefined;
}
