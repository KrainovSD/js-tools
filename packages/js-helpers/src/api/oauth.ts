import { getQueryValues, isArray, isString, startWith, waitUntil } from "../lib";
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
    waitSubWindow = 8000,
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
  } = opts;
  let processing = false;

  async function refetchAfterRefreshFlow<
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    request: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>> {
    if (processing) {
      await beforeHandler(request);
      return request;
    }
    void startRefreshFlowInSubWindow();
    await beforeHandler(request);
    return request;
  }

  async function startRefreshFlowInSubWindow() {
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
        startLoginFlow();
      }
      waiting = false;

      return;
    }

    await waitUntil(() => waiting);
    processing = false;
  }

  // Trigger an oauth flow through some proxy server
  function startLoginFlow(loginUrlArg: (() => string) | string | undefined = loginUrl) {
    loginUrlArg ??= `/api/v1/auth?frontend_protocol=${window.location.protocol.replace(":", "")}&frontend_host=${window.location.host}&comeback_path=${window.location.pathname}${encodeURIComponent(window.location.search)}`;
    window.location.replace(typeof loginUrlArg === "function" ? loginUrlArg() : loginUrlArg);
    return null;
  }

  // Trigger an oauth flow through some proxy server
  function startLogoutFlow(logoutUrlArg: (() => string) | string | undefined = logoutUrl) {
    logoutUrlArg ??= `/api/v1/auth/logout?frontend_protocol=${window.location.protocol.replace(":", "")}&frontend_host=${window.location.host}`;
    window.location.replace(typeof logoutUrlArg === "function" ? logoutUrlArg() : logoutUrlArg);
    return null;
  }

  // Processing an oauth flow: extract expires, get token, close sub windows, check if logout/clear/error url
  async function register(): Promise<boolean> {
    if (window.location.pathname === logoutPageUrl) {
      startLogoutFlow();
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
      const channel = new BroadcastChannel(OAUTH_REFRESH_QUERY);
      channel.postMessage(true);
      channel.close();
      window.close();
      return false;
    }
    /** Delete expires query */
    if (expires) {
      const url = new URL(window.location.href);
      url.searchParams.delete(expiresTokenQueryName);
      window.location.replace(url.toString());
      return false;
    }
    return true;
  }

  async function beforeHandler<
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
    startRefreshFlowInSubWindow,
    startLoginFlow,
    startLogoutFlow,
    register,
    refetchAfterRefreshFlow,
    beforeHandler,
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
