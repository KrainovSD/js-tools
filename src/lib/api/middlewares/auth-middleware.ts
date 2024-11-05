import type { AuthMiddleWareOptions, Middleware } from "../../../types";
import { waitUntil } from "../../utils";
import { tokenRequest } from "../token-request";

let isFetchingAccessToken = false;

export const generateAuthMiddleWare =
  (options: AuthMiddleWareOptions): Middleware =>
  async (request) => {
    if (
      !options.authRedirectUrl ||
      !options.authRedirectUrl ||
      !options.storageExpiresTokenName ||
      !options.storageTokenName ||
      !options.pathToExpires ||
      !options.pathToToken
    ) {
      // eslint-disable-next-line no-console
      console.error("Auth middleware hasn't required options");

      return;
    }

    const isSameOrigin = !request.path.includes("http") && !request.path.includes("https");

    if (request.token && !isSameOrigin) {
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${request.token}`,
      };

      return;
    }

    if (isFetchingAccessToken) await waitUntil(() => isFetchingAccessToken);

    const expires = localStorage.getItem(options.storageExpiresTokenName);
    let token = localStorage.getItem(options.storageTokenName);

    if (!expires || Date.now() > +expires || !token) {
      isFetchingAccessToken = true;
      token = await tokenRequest(options as Required<AuthMiddleWareOptions>);
      isFetchingAccessToken = false;
    }

    if (!isSameOrigin)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
