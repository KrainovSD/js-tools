import type { Middleware, OauthOptions } from "../../../types";
import { startWith, waitUntil } from "../../utils";
import { getOauthTokenFromOtherWindow } from "../oauth";

let isFetchingAccessToken = false;

export const generateOauthMiddleware =
  (options: OauthOptions): Middleware =>
  async (request) => {
    if (!options.expiresTokenStorageName) {
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
    let token: string | undefined | null;
    if (!expires || Number.isNaN(+expires) || Date.now() > +expires) {
      isFetchingAccessToken = true;
      await getOauthTokenFromOtherWindow({
        onlyRefreshTokenWindowQueryName: options.onlyRefreshTokenWindowQueryName,
        onWindowOpenError: options.onWindowOpenError,
        refreshTokenWindowUrl: options.refreshTokenWindowUrl,
        wait: options.wait,
        expiresTokenStorageName: options.expiresTokenStorageName,
        closeObserveInterval: options.closeObserveInterval,
      });
      if (options.tokenRequest) {
        token = await options.tokenRequest();
        if (token != undefined && options.tokenStorageName) {
          localStorage.setItem(options.tokenStorageName, token);
        }
      }
      isFetchingAccessToken = false;
    }

    if (!isSameOrigin && token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };

export async function refetchAfterOauth<T>(options: OauthOptions, refetch: () => Promise<T>) {
  isFetchingAccessToken = true;
  await getOauthTokenFromOtherWindow({
    onlyRefreshTokenWindowQueryName: options.onlyRefreshTokenWindowQueryName,
    onWindowOpenError: options.onWindowOpenError,
    refreshTokenWindowUrl: options.refreshTokenWindowUrl,
    wait: options.wait,
    expiresTokenStorageName: options.expiresTokenStorageName,
    closeObserveInterval: options.closeObserveInterval,
  });
  if (options.tokenRequest) {
    const token = await options.tokenRequest();
    if (token != undefined && options.tokenStorageName) {
      localStorage.setItem(options.tokenStorageName, token);
    }
  }
  isFetchingAccessToken = false;

  return await refetch();
}
