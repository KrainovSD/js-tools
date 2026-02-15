export const RESPONSE_DATA_SYMBOL = Symbol("response data");
export const REQUEST_ERROR = {
  HTTP_ERROR: "http",
  NETWORK_ERROR: "network",
  TIMEOUT_ERROR: "timeout",
  ABORT_ERROR: "abort",
  VALIDATION_ERROR: "validation",
  CACHE_ERROR: "cache",
  UNKNOWN_ERROR: "unknown",
} as const;

class OauthState {
  private _fetching: boolean = false;

  get fetching() {
    return this._fetching;
  }

  set fetching(value: boolean) {
    this._fetching = value;
  }
}
export const OAUTH_STATE = new OauthState();
export const OAUTH_TOKEN_STORAGE_NAME = "session_token";
export const OAUTH_TOKEN_EXPIRES_STORAGE_NAME = "session_token_expires";
export const OAUTH_REFRESH_QUERY = "only_session_refresh";
export const OAUTH_ERROR_PAGE_URL = "/error";
export const OAUTH_CLEAR_PAGE_URL = "/clear";
export const OAUTH_LOGOUT_PAGE_URL = "/logout";
