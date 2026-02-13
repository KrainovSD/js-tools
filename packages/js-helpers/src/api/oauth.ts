import { getQueryValues, isArray, isString, waitUntil } from "../lib";
import {
  OAUTH_REFRESH_QUERY,
  OAUTH_STATE,
  OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
  OAUTH_TOKEN_STORAGE_NAME,
} from "./api.constants";
import type { ExtractOauthTokenOptions, OauthOptions } from "./api.types";

export async function getOauthTokenFromOtherWindow(options: OauthOptions) {
  let waiting = true;
  const url = new URL(
    typeof options.refreshTokenWindowUrl === "function"
      ? options.refreshTokenWindowUrl()
      : (options.refreshTokenWindowUrl ?? window.origin),
  );
  // added only refresh tag to autoclose window after flow
  url.searchParams.append(options.onlyRefreshTokenWindowQueryName ?? OAUTH_REFRESH_QUERY, "true");

  // try open window with both of action
  let windowInstance = window.open(
    url.toString(),
    "_blank",
    "width=800,height=600,left=100,top=100",
  );
  windowInstance ??= window.open(url.toString(), "_blank");

  if (windowInstance) {
    const channel = new BroadcastChannel(
      options.onlyRefreshTokenWindowQueryName ?? OAUTH_REFRESH_QUERY,
    );
    const windowCloseObserver = setInterval(() => {
      if (windowInstance.closed) {
        if (waiting) {
          waiting = false;
          channel.close();
          clearInterval(windowCloseObserver);
        }
      }
    }, options.closeObserveInterval ?? 500);
    channel.onmessage = () => {
      if (waiting) {
        waiting = false;
        channel.close();
        clearInterval(windowCloseObserver);
      }
    };
    setTimeout(() => {
      if (waiting) {
        waiting = false;
        channel.close();
        clearInterval(windowCloseObserver);
      }
      if (windowInstance && !windowInstance.closed) {
        windowInstance.close();
      }
    }, options.wait ?? 8000);
  } else {
    if ("onWindowOpenError" in options) options.onWindowOpenError?.();
    else {
      getOauthToken(options.oauthUrl);
    }
    waiting = false;

    return;
  }

  await waitUntil(() => waiting);
}

export async function refetchAfterOauth<T>(options: OauthOptions, refetch: () => Promise<T>) {
  OAUTH_STATE.fetching = true;
  await getOauthTokenFromOtherWindow({
    onlyRefreshTokenWindowQueryName: options.onlyRefreshTokenWindowQueryName,
    onWindowOpenError: options.onWindowOpenError,
    refreshTokenWindowUrl: options.refreshTokenWindowUrl,
    wait: options.wait,
    closeObserveInterval: options.closeObserveInterval,
  });
  OAUTH_STATE.fetching = false;

  return await refetch();
}

// Trigger an oauth flow through some proxy server
export function getOauthToken(oauthUrl?: (() => string) | string) {
  oauthUrl ??= `/api/v1/auth?frontend_protocol=${window.location.protocol.replace(":", "")}&frontend_host=${window.location.host}&comeback_path=${window.location.pathname}${encodeURIComponent(window.location.search)}`;
  window.location.replace(typeof oauthUrl === "function" ? oauthUrl() : oauthUrl);
  return null;
}

// Processing an oauth flow: extract expires, get token, close sub windows
export async function applyOauthProvider(options: ExtractOauthTokenOptions = {}) {
  const {
    expiresTokenQueryName = OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
    onlyRefreshTokenWindowQueryName = OAUTH_REFRESH_QUERY,
    tokenStorageName = OAUTH_TOKEN_STORAGE_NAME,
    expiresTokenStorageName = OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
    tokenRequest = undefined,
  } = options;

  const queries = getQueryValues([expiresTokenQueryName, onlyRefreshTokenWindowQueryName]);
  const refreshQuery = queries?.[onlyRefreshTokenWindowQueryName];
  const expiresQuery = queries?.[expiresTokenQueryName];

  /** Is OnlyRefresh window */
  const isRefresh = isString(refreshQuery)
    ? refreshQuery === "true"
    : isArray(refreshQuery)
      ? refreshQuery[refreshQuery.length - 1] === "true"
      : false;
  /** Expires token */
  const expires = isString(expiresQuery)
    ? expiresQuery
    : isArray(expiresQuery)
      ? expiresQuery[expiresQuery.length - 1]
      : false;

  if (expires && !Number.isNaN(+expires) && Date.now() < +expires) {
    localStorage.setItem(expiresTokenStorageName, expires);
    if (tokenRequest) {
      const token = await tokenRequest();
      if (token != undefined && tokenStorageName) {
        localStorage.setItem(tokenStorageName, token);
      }
    }
  }

  /** Close if OnlyRefresh window  */
  if (isRefresh) {
    const channel = new BroadcastChannel(onlyRefreshTokenWindowQueryName);
    channel.postMessage(true);
    channel.close();
    window.close();
  }

  /** Delete expires query */
  if (expires) {
    const url = new URL(window.location.href);
    url.searchParams.delete(expiresTokenQueryName);
    window.location.replace(url.toString());
  }
}
