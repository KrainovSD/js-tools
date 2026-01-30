import { startWith, waitUntil } from "../../lib/utils";
import { OAUTH_STATE } from "../api.constants";
import type { BeforeHandler, OauthOptions } from "../api.types";
import { getOauthTokenFromOtherWindow } from "../oauth";

export const oauthBeforeHandler =
  (options: OauthOptions): BeforeHandler =>
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

    if (OAUTH_STATE.fetching) await waitUntil(() => OAUTH_STATE.fetching);

    const expires = localStorage.getItem(options.expiresTokenStorageName);
    let token: string | undefined | null;
    if (!expires || Number.isNaN(+expires) || Date.now() > +expires) {
      OAUTH_STATE.fetching = true;
      await getOauthTokenFromOtherWindow({
        onlyRefreshTokenWindowQueryName: options.onlyRefreshTokenWindowQueryName,
        onWindowOpenError: options.onWindowOpenError,
        refreshTokenWindowUrl: options.refreshTokenWindowUrl,
        wait: options.wait,
        expiresTokenStorageName: options.expiresTokenStorageName,
        closeObserveInterval: options.closeObserveInterval,
      });
      if (options.tokenStorageName) {
        token = localStorage.getItem(options.tokenStorageName);
      }
      OAUTH_STATE.fetching = false;
    }

    if (!isSameOrigin && token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
