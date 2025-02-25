import type { AuthNoRefreshMiddleWareOptions, Middleware } from "../../../types";
import { startWith, waitUntil } from "../../utils";
import { getAuthTokenNoRefresh } from "../auth";

let isFetchingAccessToken = false;

export const generateAuthNoRefreshMiddleWare =
  (options: AuthNoRefreshMiddleWareOptions): Middleware =>
  async (request) => {
    if (!options.authUrl || !options.storageTokenExpiresName || !options.errorUrl) {
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

    const expires = localStorage.getItem(options.storageTokenExpiresName);
    if (!expires || Number.isNaN(+expires) || Date.now() > +expires) {
      isFetchingAccessToken = true;
      await (options.tokenRequest ? options.tokenRequest() : getAuthTokenNoRefresh(options));
      isFetchingAccessToken = false;
    }
    const token = options.storageTokenName ? localStorage.getItem(options.storageTokenName) : null;

    if (!isSameOrigin && token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
