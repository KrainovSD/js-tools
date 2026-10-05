import { Gate, extractQueries, randomString } from "../lib";
import type { OAuthToken, RequestInterface } from "./api.types";

export type OAuthProviderOptions = {
  popup?: OAuthProviderPopupOptions;
  startSessionURL?: (() => string) | string;
  endSessionURL?: (() => string) | string;
  clearSessionURL?: string;
  errorSessionURL?: string;
  expiresQueryKey?: string;
  tokenGetter?: () => Promise<OAuthToken | null | undefined>;
  checkExpires?: boolean;
};

export type OAuthProviderPopupOptions = {
  enable?: boolean;
  startRefreshURL?: (() => string) | string;
  wait?: number;
  observeInterval?: number;
  queryKey?: string;
};

export const OAUTH_TOKEN_STORAGE_NAME = "session_token";
export const OAUTH_EXPIRES_STORAGE_NAME = "session_token_expires";

export class OAuthProvider {
  protected _popup: Required<OAuthProviderPopupOptions>;
  protected _startSessionURL: (() => string) | string;
  protected _endSessionURL: (() => string) | string;
  protected _clearSessionURL: string;
  protected _errorSessionURL: string;
  protected _expiresQueryKey: string;
  protected _checkExpires: boolean;
  protected _tokenGetter?: () => Promise<OAuthToken | null | undefined>;
  protected _refreshing = new Gate();

  constructor(opts: OAuthProviderOptions) {
    const popup = opts.popup ?? {};
    this._popup = {
      enable: false,
      startRefreshURL: window.origin,
      observeInterval: 500,
      wait: 15000,
      queryKey: "popup_session",
      ...popup,
    };
    this._startSessionURL =
      opts.startSessionURL ??
      (() => {
        return `/api/v1/auth?frontend_protocol=${window.location.protocol.slice(0, -1)}&frontend_host=${window.location.host}&comeback_path=${window.location.pathname}${encodeURIComponent(window.location.search)}`;
      });
    this._endSessionURL =
      opts.endSessionURL ??
      (() => {
        return `/api/v1/auth/end?frontend_protocol=${window.location.protocol.slice(0, -1)}&frontend_host=${window.location.host}`;
      });
    this._errorSessionURL = opts.errorSessionURL ?? "/error";
    this._clearSessionURL = opts.clearSessionURL ?? "/clear";
    this._expiresQueryKey = opts.expiresQueryKey ?? "session_expires";
    this._checkExpires = opts.checkExpires ?? true;
    this._tokenGetter = opts.tokenGetter;
  }

  get startSessionURL() {
    if (typeof this._startSessionURL == "function") {
      return this._startSessionURL();
    }
    return this._startSessionURL;
  }

  get endSessionURL() {
    if (typeof this._endSessionURL == "function") {
      return this._endSessionURL();
    }
    return this._endSessionURL;
  }

  get popupSessionURL() {
    if (typeof this._popup.startRefreshURL == "function") {
      return this._popup.startRefreshURL();
    }
    return this._popup.startRefreshURL;
  }

  get expires() {
    const expires = localStorage.getItem(OAUTH_EXPIRES_STORAGE_NAME);
    if (!expires || Number.isNaN(+expires)) return 0;
    return +expires;
  }

  get expired() {
    return !this.checkExpires(this.expires);
  }

  get token() {
    return localStorage.getItem(OAUTH_TOKEN_STORAGE_NAME);
  }

  register = async () => {
    if (this.path === this._clearSessionURL) {
      this.clearStorage();
      window.location.replace("/");
      return false;
    } else if (this.path === this._errorSessionURL) {
      this.clearStorage();
      return true;
    }
    const queries = extractQueries();
    const expires = this.getExpires(queries[this._expiresQueryKey]?.[0]);
    if (queries[this._expiresQueryKey]?.[0]) {
      const url = new URL(window.location.href);
      url.searchParams.delete(this._expiresQueryKey);
      history.replaceState(null, "", url.toString());
    }
    if (this._tokenGetter) {
      const tokenRefreshed = await this.refreshToken();
      if (!tokenRefreshed) {
        if (!this.expired) {
          window.location.replace(this._errorSessionURL);
          return false;
        }
        window.location.replace(this.startSessionURL);
        return false;
      }
    } else if (this.checkExpires(expires)) {
      localStorage.setItem(OAUTH_EXPIRES_STORAGE_NAME, String(expires));
    }
    if (this._checkExpires && this.expired) {
      window.location.replace(this.startSessionURL);
      return false;
    }
    const popup = queries[this._popup.queryKey]?.[0];
    if (popup) {
      const channel = new BroadcastChannel(popup);
      channel.postMessage(1);
      channel.close();
      window.close();
      return false;
    }
    return true;
  };

  refetch = async <
    IncomingApi,
    Incoming = IncomingApi,
    Outcoming = unknown,
    OutcomingApi = Outcoming,
  >(
    req: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
  ): Promise<RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>> => {
    if (!this._refreshing.opened) {
      await this._refreshing.wait();
      return req;
    }
    this._refreshing.lock();
    if (this._tokenGetter) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        this._refreshing.unlock();
        return req;
      }
    }
    if (this._popup.enable) {
      const refreshed = await this.startPopup();
      if (refreshed) {
        this._refreshing.unlock();
        return req;
      }
    }
    window.location.replace(this.startSessionURL);
    await this._refreshing.wait();
    return req;
  };

  newCheckExpiresHandler = () => {
    return async <
      IncomingApi,
      Incoming = IncomingApi,
      Outcoming = unknown,
      OutcomingApi = Outcoming,
    >(
      req: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
    ): Promise<void> => {
      await this._refreshing.wait();
      if (!this.expired) {
        return;
      }
      await this.refetch(req);
    };
  };

  newTokenHandler = (always: boolean = false) => {
    return async <
      IncomingApi,
      Incoming = IncomingApi,
      Outcoming = unknown,
      OutcomingApi = Outcoming,
    >(
      req: RequestInterface<IncomingApi, Incoming, Outcoming, OutcomingApi>,
    ): Promise<void> => {
      await this._refreshing.wait();
      const token = req.token ?? this.token;
      if (token && (always || !this.isSameOrigin(req.path))) {
        req.headers = {
          ...req.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    };
  };

  protected startPopup = async (): Promise<boolean> => {
    if (!this._popup.enable) return false;
    const startURL = new URL(this.popupSessionURL, window.location.origin);
    const id = randomString(10);
    startURL.searchParams.append(this._popup.queryKey, id);
    const w = Math.round(window.screen.availWidth * 0.5);
    const h = Math.round(window.screen.availHeight * 0.5);
    const left = Math.round((window.screen.availWidth - w) / 2);
    const top = Math.round((window.screen.availHeight - h) / 2);
    let popup = window.open(
      startURL.toString(),
      "_blank",
      `width=${w},height=${h},left=${left},top=${top}`,
    );
    popup ??= window.open(startURL.toString(), "_blank");
    if (!popup) {
      return false;
    }
    const promise = new Promise<boolean>((resolve) => {
      const channel = new BroadcastChannel(id);
      const observer = setInterval(() => {
        if (popup.closed) {
          resolve(false);
          clearInterval(observer);
          channel.close();
        }
      }, this._popup.observeInterval);
      channel.onmessage = function onmessage() {
        resolve(true);
        clearInterval(observer);
        channel.close();
        popup.close();
      };
      setTimeout(() => {
        resolve(false);
        clearInterval(observer);
        channel.close();
        popup.close();
      }, this._popup.wait);
    });
    return promise;
  };

  protected refreshToken = async (): Promise<boolean> => {
    if (!this._tokenGetter) return false;
    try {
      const oauthToken = await this._tokenGetter();
      if (!oauthToken) return false;
      localStorage.setItem(
        OAUTH_EXPIRES_STORAGE_NAME,
        String(this.getExpires(String(oauthToken.expires))),
      );
      localStorage.setItem(OAUTH_TOKEN_STORAGE_NAME, oauthToken.token);
      return true;
    } catch {
      return false;
    }
  };

  protected isSameOrigin = (targetURL: string) => {
    const current = new URL(window.location.origin);
    const target = new URL(targetURL, window.location.origin);
    return (
      current.protocol === target.protocol &&
      current.host === target.host &&
      current.port === target.port
    );
  };

  protected get path() {
    return window.location.pathname;
  }

  protected clearStorage() {
    localStorage.removeItem(OAUTH_TOKEN_STORAGE_NAME);
    localStorage.removeItem(OAUTH_EXPIRES_STORAGE_NAME);
  }

  protected getExpires(expiresRaw: string | undefined) {
    if (!expiresRaw || Number.isNaN(+expiresRaw)) return 0;
    return Date.now() + (+expiresRaw - 30) * 1000;
  }

  protected checkExpires(expires: number) {
    return Date.now() < expires;
  }
}
