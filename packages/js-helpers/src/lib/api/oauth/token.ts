import type { AuthTokenNoRefreshRequestOptions, OauthMiddleWareOptions } from "../../../types";
import { getQueryValues } from "../../browser";
import { isArray, isString } from "../../typings";
import { waitUntil } from "../../utils";

export async function getOauthTokenFromOtherWindow(options: AuthTokenNoRefreshRequestOptions) {
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

  windowInstance ??= window.open(url.toString());

  if (!windowInstance) {
    if (options.onWindowOpenError) options.onWindowOpenError();

    return;
  }

  const channel = new BroadcastChannel(options.onlyRefreshTokenWindowQueryName);
  channel.onmessage = () => {
    if (waiting) {
      waiting = false;
      channel.close();
    }
  };
  setTimeout(() => {
    if (waiting) {
      waiting = false;
      channel.close();
    }
    if (windowInstance && !windowInstance.closed) {
      windowInstance.close();
    }
  }, 15000);

  await waitUntil(() => waiting);
}

export function getOauthToken(options: OauthMiddleWareOptions) {
  let expires: string | null | undefined = localStorage.getItem(options.expiresTokenStorageName);
  if (!expires || Number.isNaN(+expires) || Date.now() > +expires) expires = null;

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
  const expiresFromQuery = isString(expiresQuery)
    ? expiresQuery
    : isArray(expiresQuery)
      ? expiresQuery[expiresQuery.length - 1]
      : false;

  /** Extract expires from query */
  if (!expires && expiresFromQuery) {
    expires = expiresFromQuery;
    if (!expires || Number.isNaN(+expires) || Date.now() > +expires) expires = null;
  }

  /** OAuth flow if not expires */
  if (!expires) {
    window.location.replace(
      typeof options.oauthUrl === "function" ? options.oauthUrl() : options.oauthUrl,
    );

    return null;
  }

  localStorage.setItem(options.expiresTokenStorageName, expires);

  /** Close if OnlyRefresh window  */
  if (isRefresh) {
    const channel = new BroadcastChannel(options.onlyRefreshTokenWindowQueryName);
    channel.postMessage(true);
    channel.close();
    window.close();
  }

  /** Delete expires query */
  if (expiresFromQuery) {
    const url = new URL(window.location.href);
    url.searchParams.delete(options.expiresTokenQueryName);
    window.location.replace(url.toString());

    return null;
  }

  return expires;
}
