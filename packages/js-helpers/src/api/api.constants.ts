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
