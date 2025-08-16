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

export type LoggerMiddlewareOptions = {
  filter?: (request: RequestInterface<unknown, unknown, unknown, unknown>) => boolean;
  filterPath?: (path: string) => boolean;
  filterMethod?: (method: RequestMethod) => boolean;
  filterParams?: (params?: ParamsType) => boolean;
  filterHeaders?: (headers?: Record<string, string | undefined>) => boolean;
};

export type MiddlewaresOptions = {
  oauth?: OauthMiddleWareOptions;
  logger?: LoggerMiddlewareOptions;
};

export type AuthUserUpdateRequestOptions<User extends Record<string, unknown>> =
  AuthUserRequestOptions & {
    userRequest?: () => Promise<User | null | undefined>;
    oauthUrl: () => string;
    errorUrl: string;
  };

export type AuthUserRequestOptions = {
  authUserUrl: string;
};

export type AuthTokenRequestOptions = {
  authTokenUrl: string;
  expiresTokenStorageName: string;
  tokenStorageName: string;
  pathToToken: string;
  pathToTokenExpires: string;
};

export type AuthTokenNoRefreshRequestOptions = {
  refreshTokenWindowUrl?: (() => string) | string;
  expiresTokenStorageName: string;
  onlyRefreshTokenWindowQueryName: string;
  onWindowOpenError?: () => void;
};

export type OauthMiddleWareOptions = {
  errorUrl: (() => string) | string;
  oauthUrl: (() => string) | string;
  refreshTokenWindowUrl?: (() => string) | string;
  tokenStorageName?: string;
  expiresTokenStorageName: string;
  expiresTokenQueryName: string;
  onlyRefreshTokenWindowQueryName: string;
  tokenRequest?: () => Promise<string | null | undefined>;
  onWindowOpenError?: () => void;
};
