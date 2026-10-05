export const RESPONSE_DATA_SYMBOL = Symbol("response data");
export const REQUEST_ERROR = {
  Http: "http",
  Network: "network",
  Timeout: "timeout",
  Abort: "abort",
  Validation: "validation",
  Cache: "cache",
  Unknown: "unknown",
  Disabled: "disabled",
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
