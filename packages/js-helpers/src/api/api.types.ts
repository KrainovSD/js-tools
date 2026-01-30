import type { Response as NodeResponse } from "node-fetch";
import type { ResponseError } from "../constants";
import type { IsEqual, ValueOf } from "../types";
import type { REQUEST_ERROR } from "./api.constants";

export type RequestQueryValue = string | number | boolean;
export type RequestQuery = Record<
  string,
  RequestQueryValue | RequestQueryValue[] | null | undefined
>;
export type RequestHeader = Record<string, string | string[] | undefined>;
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
export type RequestError = ValueOf<typeof REQUEST_ERROR>;

export type RequestInterface<
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
> = {
  path: string;
  method: RequestMethod;
  body?: Outcoming;
  queries?: RequestQuery;
  headers?: RequestHeader;
  /** A count of milliseconds before start request */
  delay?: number;
  /** A value that will be returned immediately */
  mock?: (() => IncomingApi) | IncomingApi;
  /** A value that will be returned after error */
  defaultResponse?: (() => IncomingApi) | IncomingApi;
  /** A boolean to download file after response */
  download?: boolean;
  signal?: AbortSignal;
  /** A token for Authorization header */
  token?: string;
  /** A function that will be call after 401 status and then trigger refetch */
  refetchAfterAuth?: (
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ) => Promise<RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>>;
  /** A boolean to activate oauth flow and then retry  */
  refetchAfterOauth?: boolean;
  /** A handlers before start request that rewrite global's handlers */
  beforeHandlers?: BeforeHandler[];
  /** A handlers after stop request that rewrite global's handlers */
  afterHandlers?: AfterHandler[];
  /** A handlers before start request with global's handlers */
  additionalBeforeHandlers?: BeforeHandler[];
  /** A handlers after stop request with global's handlers */
  additionalAfterHandlers?: AfterHandler[];
  /** An error handler */
  onError?: (type: RequestError, error: ResponseError) => void;
  /** An array of retries strategy where the number is the delay before retry, and size is the count of retries */
  retries?: number[];
  /** A count of millisecond before timeout error */
  timeout?: number;
  /** A string indicating how the request will interact with the browser's cache to set request's cache. */
  cache?: RequestCache;
  /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
  credentials?: RequestCredentials;
  /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
  integrity?: string;
  /** A boolean to set request's keepalive. */
  keepalive?: boolean;
  /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
  mode?: RequestMode;
  priority?: RequestPriority;
  /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
  redirect?: RequestRedirect;
  /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
  referrer?: string;
  /** A referrer policy to set request's referrerPolicy. */
  referrerPolicy?: ReferrerPolicy;
  /** A boolean to support gzip/deflate content encoding. (only NodeFetch) */
  compress?: boolean | undefined;
  /** A maximum redirect count. (only NodeFetch) */
  follow?: number | undefined;
} & RequestTransformIncoming<IncomingApi, Incoming> &
  RequestTransformOutcoming<Outcoming, OutcomingApi>;
export type RequestTransformOutcoming<Outcoming, OutcomingApi> =
  IsEqual<OutcomingApi, Outcoming> extends true
    ? { transformOutcomingData?: never }
    : { transformOutcomingData: (data: Outcoming) => OutcomingApi };
export type RequestTransformIncoming<IncomingApi, Incoming> =
  IsEqual<Incoming, IncomingApi> extends true
    ? { transformIncomingData?: never }
    : {
        transformIncomingData: (data: IncomingApi) => Incoming;
      };

export type BeforeHandler = <
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
>(
  request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
) => Promise<void> | void;
export type AfterHandler = <
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
>(
  request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  response: Response | NodeResponse | undefined,
) => Promise<void> | void;

export type OauthOptions = {
  /** A name of expires token in localstorage */
  expiresTokenStorageName: string;
  /** A name of flag in query for oauth flow window */
  onlyRefreshTokenWindowQueryName: string;
  /** An url of start oauth flow window */
  refreshTokenWindowUrl?: (() => string) | string;
  /** An error handle that call if oauth flow window wasn't open  */
  onWindowOpenError?: () => void;
  /** A name of token in localstorage */
  tokenStorageName?: string;
  /** A number of millisecond for waiting oauth flow window before force close it */
  wait?: number;
  /** An interval for check closable property by oauth flow window in ms */
  closeObserveInterval?: number;
};

export type GetOauthTokenOptions = {
  /** An url of start oauth flow */
  oauthUrl: (() => string) | string;
  /** A name of expires token in localstorage */
  expiresTokenStorageName: string;
  /** A name of expires token in query */
  expiresTokenQueryName: string;
  /** A name of flag in query for oauth flow window */
  onlyRefreshTokenWindowQueryName: string;
  /** A name of token in localstorage */
  tokenStorageName?: string;
  /** An url for refresh token */
  tokenRequest?: () => Promise<string | null | undefined>;
};

export type GetOauthTokenFromOtherWindowOptions = {
  /** An url of start oauth flow window */
  refreshTokenWindowUrl?: (() => string) | string;
  /** A name of flag in query for oauth flow window */
  onlyRefreshTokenWindowQueryName: string;
  /** A name of expires token in localstorage */
  expiresTokenStorageName: string;
  /** An error handle that call if oauth flow window wasn't open  */
  onWindowOpenError?: () => void;
  /** A number of millisecond for waiting oauth flow window before force close it */
  wait?: number;
  /** An interval for check closable property by oauth flow window in ms */
  closeObserveInterval?: number;
};
