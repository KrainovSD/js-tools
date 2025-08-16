import type { AuthMiddleWareOptions, Middleware } from "../../../types";
import { isNull, isUndefined } from "../../typings";
import { startWith, waitUntil } from "../../utils";
import { getAuthToken } from "../auth";

let isFetchingAccessToken = false;

export const generateAuthMiddleWare =
  (options: AuthMiddleWareOptions): Middleware =>
  async (request) => {
    if (
      !options.authTokenUrl ||
      !options.oauthUrl ||
      !options.expiresTokenStorageName ||
      !options.tokenStorageName ||
      !options.pathToTokenExpires ||
      !options.pathToToken ||
      !options.errorUrl
    ) {
      throw new Error("Auth middleware hasn't required options");
    }

    const isSameOrigin = !startWith(request.path, "http");

    if (request.token) {
      if (!isSameOrigin)
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${request.token}`,
        };

      return;
    }

    if (isFetchingAccessToken) await waitUntil(() => isFetchingAccessToken);

    const expires = localStorage.getItem(options.expiresTokenStorageName);
    let token: string | null | undefined = localStorage.getItem(options.tokenStorageName);

    if (!expires || Date.now() > +expires || !token) {
      isFetchingAccessToken = true;
      token = await (options.tokenRequest ? options.tokenRequest() : getAuthToken(options));
      isFetchingAccessToken = false;

      if (isNull(token)) {
        return void window.location.replace(
          typeof options.oauthUrl === "function" ? options.oauthUrl() : options.oauthUrl,
        );
      }
      if (isUndefined(token)) {
        return void window.location.replace(
          typeof options.errorUrl === "function" ? options.errorUrl() : options.errorUrl,
        );
      }
    }

    if (!isSameOrigin)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
