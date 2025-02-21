import type { Headers as NodeHeaders, Response as NodeResponse } from "node-fetch";
import { type API_MIDDLEWARES, type POST_API_MIDDLEWARES } from "../constants";
import type { ValueOf } from "./common";

export type ParamValueType = string | number | boolean;
export type ParamsType = Record<string, ParamValueType | ParamValueType[] | null | undefined>;
export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestInterface<T, Incoming, Body, Outcoming> {
  path: string;
  method: RequestMethod;
  body?: Body | Outcoming;
  params?: ParamsType;
  headers?: Record<string, string | undefined>;
  delay?: number;
  transformOutcomingData?: (data: Body) => Outcoming;
  transformIncomingData?: (data: Incoming) => T;
  mock?: Incoming;
  downloadFile?: boolean;
  token?: string;
  withoutResponse?: boolean;
  signal?: AbortSignal;
}

export type Middleware = <T, Incoming, Body, Outcoming>(
  request: RequestInterface<T, Incoming, Body, Outcoming>,
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
