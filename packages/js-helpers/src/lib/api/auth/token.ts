import type {
  AuthMiddleWareOptions,
  AuthNoRefreshMiddleWareOptions,
  AuthTokenNoRefreshRequestOptions,
  AuthTokenRequestOptions,
} from "../../../types";
import { getQueryValues } from "../../browser";
import { isArray, isNull, isNumber, isObject, isString, isUndefined } from "../../typings";
import { getByPath, waitUntil } from "../../utils";

export async function updateAuthToken(options: AuthMiddleWareOptions) {
  let token: string | null | undefined = localStorage.getItem(options.tokenStorageName);
  const expires: string | null | undefined = localStorage.getItem(options.expiresTokenStorageName);

  if (!token || !expires || Date.now() > +expires) {
    token = await (options.tokenRequest ? options.tokenRequest() : getAuthToken(options));
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

  return token;
}

export async function getAuthToken(options: AuthTokenRequestOptions) {
  let status = 0;
  try {
    const response = await fetch(options.authTokenUrl, {
      method: "GET",
    });
    status = response.status;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = (await response.json()) as Record<string, unknown>;

    try {
      const { expires, token } = transformData(
        result,
        options.pathToToken,
        options.pathToTokenExpires,
      );

      localStorage.setItem(options.expiresTokenStorageName, expires);
      localStorage.setItem(options.tokenStorageName, token);

      return token;
    } catch {
      return undefined;
    }
  } catch {
    if (status >= 500) return undefined;

    return null;
  }
}

function transformData(data: unknown, pathToToken: string, pathToTokenExpires: string) {
  if (!isObject(data)) throw new Error("Bad response data");

  const token = getByPath(data, pathToToken);
  const expiresToken = getByPath(data, pathToTokenExpires);

  if ((!isString(expiresToken) && !isNumber(expiresToken)) || !isString(token))
    throw new Error("Bad response data");

  return {
    expires: String(expiresToken),
    token,
  };
}

export async function getAuthTokenNoRefresh(options: AuthTokenNoRefreshRequestOptions) {
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

export function updateAuthTokenNoRefresh(options: AuthNoRefreshMiddleWareOptions) {
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
