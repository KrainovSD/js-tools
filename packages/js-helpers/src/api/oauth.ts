import { getQueryValues, isArray, isString, waitUntil } from "../lib";
import { OAUTH_STATE } from "./api.constants";
import type {
  GetOauthTokenFromOtherWindowOptions,
  GetOauthTokenOptions,
  OauthOptions,
} from "./api.types";

export async function getOauthTokenFromOtherWindow(options: GetOauthTokenFromOtherWindowOptions) {
  let waiting = true;
  const url = new URL(
    typeof options.refreshTokenWindowUrl === "function"
      ? options.refreshTokenWindowUrl()
      : (options.refreshTokenWindowUrl ?? window.origin),
  );
  url.searchParams.append(options.onlyRefreshTokenWindowQueryName, "true");

  let windowInstance = window.open(
    url.toString(),
    "_blank",
    "width=800,height=600,left=100,top=100",
  );
  windowInstance ??= window.open(url.toString(), "_blank");

  if (windowInstance) {
    const channel = new BroadcastChannel(options.onlyRefreshTokenWindowQueryName);
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
    }, options.wait ?? 15000);
  } else {
    if (options.onWindowOpenError) options.onWindowOpenError();
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
    expiresTokenStorageName: options.expiresTokenStorageName,
    closeObserveInterval: options.closeObserveInterval,
  });
  OAUTH_STATE.fetching = false;

  return await refetch();
}

export async function getOauthToken(options: GetOauthTokenOptions) {
  const queries = getQueryValues([
    options.expiresTokenQueryName,
    options.onlyRefreshTokenWindowQueryName,
  ]);
  const refreshQuery = queries?.[options.onlyRefreshTokenWindowQueryName];
  const expiresQuery = queries?.[options.expiresTokenQueryName];

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

  /** OAuth flow if not expires */
  if (!expires) {
    window.location.replace(
      typeof options.oauthUrl === "function" ? options.oauthUrl() : options.oauthUrl,
    );

    return null;
  }

  localStorage.setItem(options.expiresTokenStorageName, expires);
  if (options.tokenRequest) {
    const token = await options.tokenRequest();
    if (token != undefined && options.tokenStorageName) {
      localStorage.setItem(options.tokenStorageName, token);
    }
  }
  /** Close if OnlyRefresh window  */
  if (isRefresh) {
    const channel = new BroadcastChannel(options.onlyRefreshTokenWindowQueryName);
    channel.postMessage(true);
    channel.close();
    window.close();
  }

  /** Delete expires query */
  if (expires) {
    const url = new URL(window.location.href);
    url.searchParams.delete(options.expiresTokenQueryName);
    window.location.replace(url.toString());

    return null;
  }

  return expires;
}
