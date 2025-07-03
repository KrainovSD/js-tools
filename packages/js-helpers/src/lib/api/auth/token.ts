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
  let token: string | null | undefined = localStorage.getItem(options.storageTokenName);
  const expires: string | null | undefined = localStorage.getItem(options.storageTokenExpiresName);

  if (!token || !expires || Date.now() > +expires) {
    token = await (options.tokenRequest ? options.tokenRequest() : getAuthToken(options));
    if (isNull(token)) {
      return void window.location.replace(options.authUrl());
    }
    if (isUndefined(token)) {
      return void window.location.replace(options.errorUrl);
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

      localStorage.setItem(options.storageTokenExpiresName, expires);
      localStorage.setItem(options.storageTokenName, token);

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
  const url = new URL(window.origin);
  url.searchParams.append(options.queryIsRefreshTokenName, "true");
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

  const channel = new BroadcastChannel(options.queryIsRefreshTokenName);
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
  let expires: string | null | undefined = localStorage.getItem(options.storageTokenExpiresName);
  if (!expires || Number.isNaN(+expires) || Date.now() > +expires) expires = null;

  const queries = getQueryValues([options.queryTokenExpiresName, options.queryIsRefreshTokenName]);
  const refreshQuery = queries?.[options.queryIsRefreshTokenName];
  const expiresQuery = queries?.[options.queryTokenExpiresName];

  const isRefresh = isString(refreshQuery)
    ? refreshQuery === "true"
    : isArray(refreshQuery)
      ? refreshQuery[refreshQuery.length - 1] === "true"
      : false;
  const expiresFromQuery = isString(expiresQuery)
    ? expiresQuery
    : isArray(expiresQuery)
      ? expiresQuery[expiresQuery.length - 1]
      : false;

  if (!expires && expiresFromQuery) {
    expires = expiresFromQuery;
    if (!expires || Number.isNaN(+expires) || Date.now() > +expires) expires = null;
  }

  if (!expires) {
    window.location.replace(options.authUrl());

    return null;
  }

  localStorage.setItem(options.storageTokenExpiresName, expires);

  if (isRefresh) {
    const channel = new BroadcastChannel(options.queryIsRefreshTokenName);
    channel.postMessage(true);
    channel.close();
    window.close();
  }

  if (expiresFromQuery) {
    const url = new URL(window.location.href);
    url.searchParams.delete(options.queryTokenExpiresName);
    window.location.replace(url.toString());

    return null;
  }

  return expires;
}
