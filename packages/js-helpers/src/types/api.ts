import type { Headers as NodeHeaders, Response as NodeResponse } from "node-fetch";
import { type API_MIDDLEWARES, type POST_API_MIDDLEWARES } from "../constants";
import type { IsEqual, ValueOf } from "./common";

export type ParamValueType = string | number | boolean;
export type ParamsType = Record<string, ParamValueType | ParamValueType[] | null | undefined>;
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestInterface<
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
> = {
  path: string;
  method: RequestMethod;
  body?: Outcoming;
  params?: ParamsType;
  headers?: Record<string, string | undefined>;
  delay?: number;
  mock?: (() => IncomingApi) | IncomingApi;
  defaultResponse?: (() => IncomingApi) | IncomingApi;
  downloadFile?: boolean;
  signal?: AbortSignal;
  token?: string;
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

export type Middleware = <
  IncomingApi,
  Incoming = IncomingApi,
  Outcoming = unknown,
  OutcomingApi = Outcoming,
>(
  request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
) => Promise<unknown>;

export type PostMiddleware = (response: Response | NodeResponse | undefined) => Promise<unknown>;
export type PostMiddlewareType = ValueOf<typeof POST_API_MIDDLEWARES>;
export type ActivePostMiddleware = PostMiddlewareType[];

export type LoggerPostMiddlewareOptions = {
  filter?: (response: Response | NodeResponse | undefined) => boolean;
  filterStatus?: (status: number) => boolean;
  filterUrl?: (url: string) => boolean;
  filterHeaders?: (headers: Headers | NodeHeaders) => boolean;
};

export type PostMiddlewareOptions = {
  logger?: LoggerPostMiddlewareOptions;
};

export type MiddlewareType = ValueOf<typeof API_MIDDLEWARES>;
export type ActiveMiddleware = MiddlewareType[];

export type AuthMiddleWareOptions = {
  errorUrl: string;
  authUrl: () => string;
  authTokenUrl: string;
  storageTokenExpiresName: string;
  storageTokenName: string;
  pathToToken: string;
  pathToTokenExpires: string;
  tokenRequest?: () => Promise<string | null | undefined>;
};

export type LoggerMiddlewareOptions = {
  filter?: (request: RequestInterface<unknown, unknown, unknown, unknown>) => boolean;
  filterPath?: (path: string) => boolean;
  filterMethod?: (method: RequestMethod) => boolean;
  filterParams?: (params?: ParamsType) => boolean;
  filterHeaders?: (headers?: Record<string, string | undefined>) => boolean;
};

export type MiddlewaresOptions = {
  auth?: AuthMiddleWareOptions;
  authNoRefresh?: AuthNoRefreshMiddleWareOptions;
  logger?: LoggerMiddlewareOptions;
};

export type AuthUserUpdateRequestOptions<User extends Record<string, unknown>> =
  AuthUserRequestOptions & {
    userRequest?: () => Promise<User | null | undefined>;
    authUrl: () => string;
    errorUrl: string;
  };

export type AuthUserRequestOptions = {
  authUserUrl: string;
};

export type AuthTokenRequestOptions = {
  authTokenUrl: string;
  storageTokenExpiresName: string;
  storageTokenName: string;
  pathToToken: string;
  pathToTokenExpires: string;
};

export type AuthTokenNoRefreshRequestOptions = {
  storageTokenExpiresName: string;
  queryIsRefreshTokenName: string;
  onWindowOpenError?: () => void;
};

export type AuthNoRefreshMiddleWareOptions = {
  errorUrl: string;
  authUrl: () => string;
  storageTokenName?: string;
  storageTokenExpiresName: string;
  queryTokenExpiresName: string;
  queryIsRefreshTokenName: string;
  tokenRequest?: () => Promise<string | null | undefined>;
  onWindowOpenError?: () => void;
};
