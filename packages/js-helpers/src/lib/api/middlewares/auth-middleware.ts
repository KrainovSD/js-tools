import type { AuthMiddleWareOptions, Middleware } from "../../../types";
import { isNull, isUndefined } from "../../typings";
import { waitUntil } from "../../utils";
import { getAuthToken } from "../auth";

let isFetchingAccessToken = false;

export const generateAuthMiddleWare =
  (options: AuthMiddleWareOptions): Middleware =>
  async (request) => {
    if (
      !options.authTokenUrl ||
      !options.authUrl ||
      !options.storageTokenExpiresName ||
      !options.storageTokenName ||
      !options.pathToTokenExpires ||
      !options.pathToToken ||
      !options.errorUrl
    ) {
      throw new Error("Auth middleware hasn't required options");
    }

    const isSameOrigin = !request.path.includes("http") && !request.path.includes("https");

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
    let token: string | null | undefined = localStorage.getItem(options.storageTokenName);

    if (!expires || Date.now() > +expires || !token) {
      isFetchingAccessToken = true;
      token = await (options.tokenRequest ? options.tokenRequest() : getAuthToken(options));
      isFetchingAccessToken = false;

      if (isNull(token)) {
        return void window.location.replace(options.authUrl);
      }
      if (isUndefined(token)) {
        return void window.location.replace(options.errorUrl);
      }
    }

    if (!isSameOrigin)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
