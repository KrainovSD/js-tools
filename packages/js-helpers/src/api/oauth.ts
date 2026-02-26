import { getQueryValues, isArray, isString, startWith, wait, waitUntil } from "../lib";
import {
  OAUTH_CLEAR_PAGE_URL,
  OAUTH_ERROR_PAGE_URL,
  OAUTH_LOGOUT_PAGE_URL,
  OAUTH_REFRESH_QUERY,
  OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
  OAUTH_TOKEN_STORAGE_NAME,
} from "./api.constants";
import type { OauthOptions, RequestInterface } from "./api.types";

export function createOauthProvider(opts: OauthOptions = {}) {
  const {
    refreshTokenWindowUrl = window.origin,
    closeObserveSubWindowInterval = 500,
    waitSubWindow = 15000,
    loginUrl = undefined,
    logoutUrl = undefined,
    clearPageUrl = OAUTH_CLEAR_PAGE_URL,
    errorPageUrl = OAUTH_ERROR_PAGE_URL,
    logoutPageUrl = OAUTH_LOGOUT_PAGE_URL,
    afterClearPageUrl = "/",
    expiresTokenQueryName = OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
    tokenStorageName = OAUTH_TOKEN_STORAGE_NAME,
    expiresTokenStorageName = OAUTH_TOKEN_EXPIRES_STORAGE_NAME,
    tokenRequest = undefined,
    forceSetToken = false,
    subWindow = true,
    refreshToken = false,
  } = opts;
  let processing = false;

  function getExpires(expires: number) {
    return Date.now() + (expires - 30);
  }
  function checkExpires(expires: null | undefined | string | number): expires is number | string {
    return expires != undefined && !Number.isNaN(+expires) && Date.now() < +expires;
  }

  async function refetchAfterRefreshFlow<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>> {
    if (processing) {
      await beforeHandlerSetToken(request);
      return request;
    }
    processing = true;
    if (refreshToken && tokenRequest) {
      const tokenInfo = await startRefreshFlow();
      if (tokenInfo == undefined) {
        if (subWindow) {
          await startLoginFlowInSubWindow();
        } else {
          await startLoginFlow();
        }
        processing = false;
        await beforeHandlerSetToken(request);
        return request;
      }
      processing = false;
      await beforeHandlerSetToken(request);
      return request;
    }
    if (subWindow) {
      await startLoginFlowInSubWindow();
    } else {
      await startLoginFlow();
    }
    processing = false;
    await beforeHandlerSetToken(request);
    return request;
  }

  async function startLoginFlowInSubWindow() {
    processing = true;
    let waiting = true;
    const url = new URL(
      typeof refreshTokenWindowUrl === "function" ? refreshTokenWindowUrl() : refreshTokenWindowUrl,
    );
    // added only refresh tag to autoclose window after flow
    url.searchParams.append(OAUTH_REFRESH_QUERY, "true");

    // try open window with both of action
    let windowInstance = window.open(
      url.toString(),
      "_blank",
      "width=800,height=600,left=100,top=100",
    );
    windowInstance ??= window.open(url.toString(), "_blank");

    if (windowInstance) {
      const channel = new BroadcastChannel(OAUTH_REFRESH_QUERY);
      const windowCloseObserver = setInterval(() => {
        if (windowInstance.closed) {
          if (waiting) {
            waiting = false;
            channel.close();
            clearInterval(windowCloseObserver);
          }
        }
      }, closeObserveSubWindowInterval);
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
      }, waitSubWindow);
    } else {
      if ("onSubWindowOpenError" in opts) opts.onSubWindowOpenError?.();
      else {
        await startLoginFlow();
      }
      waiting = false;

      return;
    }

    await waitUntil(() => waiting);
    processing = false;
  }

  // Trigger an oauth flow through some proxy server
  async function startLoginFlow(
    loginUrlArg: (() => string) | string | undefined = loginUrl,
    delay: number = 2000,
  ) {
    loginUrlArg ??= `/api/v1/auth?frontend_protocol=${window.location.protocol.replace(":", "")}&frontend_host=${window.location.host}&comeback_path=${window.location.pathname}${encodeURIComponent(window.location.search)}`;
    window.location.replace(typeof loginUrlArg === "function" ? loginUrlArg() : loginUrlArg);
    await wait(delay);
    return null;
  }

  // Trigger an oauth flow through some proxy server
  async function startLogoutFlow(
    logoutUrlArg: (() => string) | string | undefined = logoutUrl,
    delay: number = 2000,
  ) {
    logoutUrlArg ??= `/api/v1/auth/logout?frontend_protocol=${window.location.protocol.replace(":", "")}&frontend_host=${window.location.host}`;
    window.location.replace(typeof logoutUrlArg === "function" ? logoutUrlArg() : logoutUrlArg);
    await wait(delay);
    return null;
  }

  async function startRefreshFlow() {
    const tokenInfo = await tokenRequest?.();
    if (tokenInfo) {
      localStorage.setItem(tokenStorageName, tokenInfo.token);
      if (tokenInfo.expires !== 0) {
        localStorage.setItem(expiresTokenStorageName, String(getExpires(tokenInfo.expires)));
      }
    }
    return tokenInfo;
  }

  // Processing an oauth flow: extract expires, get token, close sub windows, check if logout/clear/error url
  async function register(): Promise<boolean> {
    if (window.location.pathname === logoutPageUrl) {
      await startLogoutFlow();
      return false;
    }
    if (window.location.pathname === clearPageUrl) {
      localStorage.removeItem(expiresTokenStorageName);
      localStorage.removeItem(tokenStorageName);
      window.location.replace(afterClearPageUrl);
      return false;
    }
    if (window.location.pathname === errorPageUrl) {
      localStorage.removeItem(expiresTokenStorageName);
      localStorage.removeItem(tokenStorageName);
      return false;
    }

    const queries = getQueryValues([expiresTokenQueryName, OAUTH_REFRESH_QUERY]);

    const refreshQuery = queries?.[OAUTH_REFRESH_QUERY];
    const expiresQuery = queries?.[expiresTokenQueryName];

    /** Is OnlyRefresh window */
    const isRefresh = isString(refreshQuery)
      ? refreshQuery === "true"
      : isArray(refreshQuery)
        ? refreshQuery[refreshQuery.length - 1] === "true"
        : null;
    /** Expires token */
    const expires = isString(expiresQuery)
      ? expiresQuery
      : isArray(expiresQuery)
        ? expiresQuery[expiresQuery.length - 1]
        : null;

    if (checkExpires(expires)) {
      localStorage.setItem(expiresTokenStorageName, expires);
      if (tokenRequest) {
        const tokenInfo = await tokenRequest();
        if (tokenInfo != undefined) {
          localStorage.setItem(tokenStorageName, tokenInfo.token);
        }
      }

      /** Close if OnlyRefresh window  */
      if (isRefresh) {
        const channel = new BroadcastChannel(OAUTH_REFRESH_QUERY);
        channel.postMessage(true);
        channel.close();
        window.close();
        return false;
      }

      /** Delete expires query */
      const url = new URL(window.location.href);
      url.searchParams.delete(expiresTokenQueryName);
      window.location.replace(url.toString());
      return false;
    }

    return true;
  }

  async function beforeHandlerCheckExpires<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>): Promise<void> {
    const expires = localStorage.getItem(expiresTokenStorageName);
    if (checkExpires(expires)) {
      return;
    }
    await refetchAfterRefreshFlow(request);
  }

  async function beforeHandlerSetToken<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>): Promise<void> {
    if (processing) await waitUntil(() => processing);

    const token = request.token ?? localStorage.getItem(tokenStorageName);
    const isSameOrigin =
      request.path.includes(window.location.origin) || !startWith(request.path, "http");
    if ((!isSameOrigin || forceSetToken) && token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  }

  return {
    startRefreshFlow,
    startLoginFlowInSubWindow,
    startLoginFlow,
    startLogoutFlow,
    refetchAfterRefreshFlow,
    beforeHandlerSetToken,
    beforeHandlerCheckExpires,
    register,
    get isServicePage() {
      return [errorPageUrl, clearPageUrl, logoutPageUrl].some(
        (u) => document.location.pathname === u,
      );
    },
    get processing() {
      return processing;
    },
    get token() {
      return localStorage.getItem(tokenStorageName);
    },
    get expires() {
      const expires = localStorage.getItem(expiresTokenStorageName);
      return expires == undefined ? null : Number.isNaN(+expires) ? null : +expires;
    },
    get expired() {
      const expiresStr = localStorage.getItem(expiresTokenStorageName);
      const expires =
        expiresStr == undefined ? null : Number.isNaN(+expiresStr) ? null : +expiresStr;
      return expires == undefined ? true : Date.now() > expires;
    },
  };
}
