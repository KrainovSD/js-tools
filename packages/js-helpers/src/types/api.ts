import { type API_MIDDLEWARES } from "../constants";
import type { ValueOf } from "./common";

export type ParamValueType = string | number | boolean;
export type ParamsType = Record<string, ParamValueType | ParamValueType[] | null | undefined>;

export interface RequestInterface<T, Incoming, Body, Outcoming> {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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

export type MiddlewaresOptions = {
  auth?: AuthMiddleWareOptions;
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
