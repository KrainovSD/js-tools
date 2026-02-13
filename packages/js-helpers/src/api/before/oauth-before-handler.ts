import { startWith, waitUntil } from "../../lib/utils";
import { OAUTH_STATE, OAUTH_TOKEN_STORAGE_NAME } from "../api.constants";
import type { AuthBeforeHandlerOptions, BeforeHandler } from "../api.types";

export const authBeforeHandler =
  (options: AuthBeforeHandlerOptions = {}): BeforeHandler =>
  async (request) => {
    const { tokenStorageName = OAUTH_TOKEN_STORAGE_NAME, forceSetToken = false } = options;
    if (OAUTH_STATE.fetching) await waitUntil(() => OAUTH_STATE.fetching);

    const token = request.token ?? localStorage.getItem(tokenStorageName);
    const isSameOrigin =
      request.path.includes(window.location.origin) || !startWith(request.path, "http");
    if ((!isSameOrigin || forceSetToken) && token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      };
  };
